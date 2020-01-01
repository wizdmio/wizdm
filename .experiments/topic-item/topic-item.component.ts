import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject, Subscription, of, merge } from 'rxjs';
import { map, tap, startWith, distinctUntilChanged } from 'rxjs/operators';
import { DatabaseDocument, DatabaseCollection, DistributedCounter, dbCommon } from '@wizdm/connect/database';
import { DatabaseService } from '@wizdm/connect/database';
import { wmDocument } from '@wizdm/editable';
import { Member, wmMember } from 'app/core/member';
import { $animations } from './topic-item.animations';
//import moment from 'moment';

export interface wmTopic extends wmDocument, dbCommon {
  
  name     : string;
  author   : string;
  pitch?   : string;
  logo?    : string;
  web?     : string;
}

@Component({
  selector: 'wm-topic-item',
  templateUrl: './topic-item.component.html',
  styleUrls: ['./topic-item.component.scss'],
  host: { 'class': 'mat-elevation-z1' },
  animations: $animations
})
export class TopicComponent extends DatabaseDocument<wmTopic> implements OnDestroy {

  // Local data snapshot
  protected data: wmTopic = <wmTopic>{};
  
  // Author observable resolving to the author user profile
  public author$: Observable<wmMember>;
  
  // Likes counter
  public likes: DistributedCounter;
  
  // Collection of topic's likers
  public likedBy: DatabaseCollection<dbCommon>;
  
  // Favorite observable
  private _favorite$ = new BehaviorSubject<boolean>(false);
  public favorite$: Observable<boolean>;

  // Returns the project properties
  get name() { return !!this.data && this.data.name || ''; }
  get author() { return !!this.data && this.data.author || ''; }
  get pitch() { return !!this.data && this.data.pitch || ''; }
  get logo() { return !!this.data && this.data.logo || ''; }
  get web() { return !!this.data && this.data.web || ''; }

  // This project as an editable document
  get document() { return this.data as wmDocument; }

  // The current authenticate user's id
  get me() { return this.profile.uid || ''; }

  // The latest favorite flag value
  get favorite() { return this._favorite$.value; }
  
  constructor(readonly profile: Member, db: DatabaseService, id: string) { 
    super(db, db.doc(`/projects/${id}`)); 
  }

  ngOnDestroy() { this.release(); }

  @Input() set topic(data: wmTopic) { 
    this.wrap(data); 
  }


  @Output() open = new EventEmitter<string>();

  private sub: Subscription;

  // Wraps the given project 
  public wrap(source: wmTopic): this {

    // Unsubscribe to previous subscriptions
    this.release();

    // Assigns the document id first 
    this.ref = this.db.doc(`/projects/${source.id}`);

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
  public resolveAuthor(): Observable<wmMember> {

    // Short-circuit in case the author is the current user
    if( this.isMine ) { return of(this.profile.data); }
    // Load the author data once
    return this.db.document<wmMember>(`/users/${this.author}`).stream();
  }

  // Resolves the favorite flag from the collection of project's likers
  private resolveFavorite(likedBy: DatabaseCollection<dbCommon>): Observable<boolean> {

    // Merges a local copy with the remote value to improve reactivity
    return merge(
      // The local copy
      this._favorite$,
      // Streams the collection selecting the very document matching the authenticated user 
      likedBy.stream( ref => ref.where(this.db.sentinelId, "==", this.me || 'anonymous') ).pipe( 
        // Returns true whenever there's a document
        map( docs => docs.length > 0 ), 
        // Updates the local copy
        tap( favorite => this._favorite$.next(favorite) ) 
      )
      // Filters the unchanged value updates
    ).pipe( distinctUntilChanged() );
  }

  // Forces the data to be fully reloaded from the database
  public reload(): Promise<this> {
    return this.get().then( project => this.wrap(project) );
  }

  public update(data: wmTopic) {
    // Updated the local copy first
    Object.assign(this.data, data);
    // Updates the database next
    return super.update(data);
  }

  public updateLogo(url: string) {

    return this.update({ logo: url || '' } as wmTopic);
  }

  public delete(): Promise<void> {

    // Wipes the associated likes first
    return this.likes.wipe()
    // Deletes the project from the db
      .then(() => super.delete() )
      // Resets the buffered data
      .then(() => { this.data = <wmTopic>{} });
  }

  public toggleFavorite() {

    // Skips when not authenticated
    if(!this.me) { return; }
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

/*
  public modifiedOn(project: Project): string {
    const timestamp = project.data.updated || project.data.created;
    return moment(timestamp ? timestamp.toMillis() : undefined).format('lll');
  }
*/
}
