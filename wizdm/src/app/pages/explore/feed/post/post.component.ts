import { DatabaseCollection, QueryDocumentSnapshot } from '@wizdm/connect/database/collection';
import { DatabaseDocument, DocumentData } from '@wizdm/connect/database/document';
import { map, tap, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { DistributedCounter } from '@wizdm/connect/database/counter';
import { Component, Input, HostBinding } from '@angular/core';
import { Observable, BehaviorSubject, merge } from 'rxjs';
import { DatabaseService } from '@wizdm/connect/database';
import { AuthService } from '@wizdm/connect/auth';
import { $animations } from './post.animations';

export interface PostData extends DocumentData {
  channel?: string;
  title?  : string;
  text?   : string; 
  photo?  : string;
  author? : string; 
  tags?   : string[]; 
};

@Component({
  selector: 'wm-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  animations: $animations 
})
export class PostComponent extends DatabaseDocument<PostData> {

  private _favorite$ = new BehaviorSubject<boolean>(false);  
  private likers: DatabaseCollection<any>;
  
  public favorite$: Observable<boolean>;
  public likes: DistributedCounter;
  public data: PostData;
  
  /** Returns the current authenticated userId or 'unknown' */
  get me(): string { return this.auth.userId || 'unknown'; }
  /** Returns true thenever the place is favorite */
  get favorite(): boolean { return this._favorite$.value; }
  /** Returns true whenever the current user is authenticated */
  get authenticated(): boolean { return this.authenticated; }

  constructor(db: DatabaseService, private auth: AuthService) { 
    super(db)
  }

  @Input() set post(snapshot: QueryDocumentSnapshot<PostData>) { 

    // Unwraps the document data and reference
    this.data = this.unwrap(snapshot);
    
    // Gets the likes distributed counter
    this.likes = this.counter('likes');
    
     // Gets the collection of likers
    this.likers = this.collection('likers');
    
    // Builds the favorite flag
    this.favorite$ = this.initFavorite();   
 }

  /** Builds the favorite flag Observable */
  private initFavorite(): Observable<boolean> {
    
    return merge(
      // Here the local copy 
      this._favorite$,
      // Resolves the user
      this.auth.user$.pipe( 
        // Gets the current user id
        map(user => !!user ? user.uid : 'unknown'),
        // Seeks for the user id within the collection of likers
        switchMap( me => this.isLikedBy(me) ),
        // Syncs the local copy
        tap( favorite => this._favorite$.next(favorite) ) 
      )
      // Distinct changes to avoid unwanted flickering
    ).pipe( distinctUntilChanged() );
  }

  /** Checks if the specified userId is among the likers */
  private isLikedBy(userId: string): Observable<boolean> {

    // Searches among the collection of likers 
    return this.likers
      // Matches for the document named upon the userId
      .stream( ref => ref.where(this.db.sentinelId, "==", userId ) )
      // Returns true if such document exists
      .pipe( map( docs => docs.length > 0 ) );
  }
  
  /** Toggles the favorite status */
  public toggleFavorite() {

    // Negates the curret favorite value
    const favorite = !this.favorite;

    // Updates the local favorite flag copy for improved reactivity
    this._favorite$.next(favorite);

    // Adds the user to the collection of likers....
    if(favorite) { this.likers.document(this.me).set({}); }
    // ...or removes it according to the request
    else { this.likers.document(this.me).delete(); }

    // Updates the likes counter accordingly
    this.likes.update( favorite ? 1 : -1 );
  }
}