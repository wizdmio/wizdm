import { DatabaseDocument, DatabaseCollection, DistributedCounter, dbCommon, wmUser } from '@wizdm/connect';
import { wmRoot } from '@wizdm/editable';
import { Observable, BehaviorSubject, Subscription, of, merge } from 'rxjs';
import { map, tap, startWith, distinctUntilChanged } from 'rxjs/operators';
import { ProjectService } from './project.service';

export interface wmProject extends wmRoot, dbCommon {
  
  name     : string;
  author   : string;
  pitch?   : string;
  logo?    : string;
}

export class ProjectWrapper extends DatabaseDocument<wmProject> {

  // Local data snapshot
  protected data: wmProject = <wmProject>{};
  
  // Author observable resolving to the author user profile
  public author$: Observable<wmUser>;
  
  // Likes counter
  public likes: DistributedCounter;
  
  // Collection of project's likers
  public likedBy: DatabaseCollection<dbCommon>;
  
  // Favorite observable
  private _favorite$: BehaviorSubject<boolean>;
  public favorite$: Observable<boolean>;
  
  private sub: Subscription;
  
  constructor(readonly ps: ProjectService, id: string) { 
    super(ps.db, '/projects', id); 

    this._favorite$ = new BehaviorSubject<boolean>(false);
  }

  // Returns the project properties
  get name() { return !!this.data && this.data.name || ''; }
  get author() { return !!this.data && this.data.author || ''; }
  get pitch() { return !!this.data && this.data.pitch || ''; }
  get logo() { return !!this.data && this.data.logo || ''; }

  // This project as an editable document
  get document() { return this.data as wmRoot; }

  // The current authenticate user's id
  get me() { return this.ps.userId; }

  // The latest favorite flag value
  get favorite() { return this._favorite$.value; }

  // Wraps the given project 
  public wrap(source: wmProject): this {

    // Unsubscribe to previous subscriptions
    this.release();

    // Assigns the document id first 
    this.id = source.id;

    // Saves the data snapshot
    this.data = source;

    // Resolve the author profile as an observable
    this.author$ = this.resolveAuthor();

    // Creates/connects to the likes counter
    this.likes = this.counter('likes');

    // Connects to the collection of users liking this project
    this.likedBy = this.collection('likedBy');

    // Resolves the favorite flag from the likedBy collection
    this.favorite$ = this.resolveFavorite(this.likedBy);

    // Keeps the data in sync with the database
    this.sub = this.stream().pipe( startWith(source) )
      .subscribe( data => this.data = data );
    
    // Syncs the favorite flag as well
    this.sub.add( this.favorite$.subscribe() );

    return this;
  }

  // Releases the observable's subscriptions
  public release() {
    !!this.sub && this.sub.unsubscribe();
  }

  // True whenever the project author matches the current authenticated user
  public get isMine(): boolean {
    return this.author === this.me;
  }

  // Resolves the project author
  public resolveAuthor(): Observable<wmUser> {

    // Short-circuit in case the author is the current user
    if( this.isMine ) { return of(this.ps.profile.data); }
    // Load the author data once
    return this.db.document<wmUser>('/users', this.author).get();
  }

  // Resolves the favorite flag from the collection of project's likers
  private resolveFavorite(likedBy: DatabaseCollection<dbCommon>): Observable<boolean> {

    // Merges a local copy with the remote value to improve reactivity
    return merge(
      // The local copy
      this._favorite$,
      // Streams the collection selecting the very document matching the authenticated user 
      likedBy.stream( ref => ref.where(this.ps.db.sentinelId, "==", this.me) ).pipe( 
        // Returns true whenever there's a document
        map( docs => docs.length > 0 ), 
        // Updates the local copy
        tap( favorite => this._favorite$.next(favorite) ) 
      )
      // Filters the unchanged value updates
    ).pipe( distinctUntilChanged() );
  }

  // Forces the data to be fully reloaded from the database
  public reload(): Observable<this> {
    return this.get()
      .pipe( map( project => {
        return this.wrap(project);
      }));
  }

  // Updates the database contents making sure to update the buffered copy as well
  public update(data: wmProject): Promise<void> {
    // Sanitizes the new data
    const sanitized = this.ps.sanitizeData(data);
    // Updates the local buffered data without mutating the object
    Object.assign(this.data, sanitized);
    // Updates the database
    return super.update( sanitized );
  }

  public delete(): Promise<void> {
    // Deletes the project from the db
    return super.delete()
      .then(() => {
        // Wipes the associated likes
        this.likes.wipe();
        // Resets the buffered data
        this.data = <wmProject>{};
      } );
  }

  public toggleFavorite() {
    // Gets the toggled value
    const favorite = !this.favorite; 
    // Pushes the new favorite flag value into the local copy to update the UI
    this._favorite$.next(favorite);
    // Adds/removes the current user to the list of likers
    if(favorite) { this.likedBy.document(this.me).set({}); }
    else { this.likedBy.document(this.me).delete(); }
    // Updates the likes counter
    this.likes.update( favorite ? 1 : -1 );
  }
}