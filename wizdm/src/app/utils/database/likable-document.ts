import { DatabaseDocument, DocumentData, DocumentSnapshot } from '@wizdm/connect/database/document';
import { DatabaseCollection } from '@wizdm/connect/database/collection';
import { DistributedCounter } from '@wizdm/connect/database/counter';
import { DatabaseService } from '@wizdm/connect/database';
import { AuthService } from '@wizdm/connect/auth';
import { switchMap, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

/** A DatabaseDocument with "likes" */
export class LikableDocument<T extends DocumentData> extends DatabaseDocument<T> {

  /** The likers database collection */
  protected likers: DatabaseCollection<any>;
  
  /** The likes distributed counter instance */
  protected likes: DistributedCounter;

  /** Favorite's flag */
  public favorite$: Observable<boolean>;

  /** Likes counter */
  public get likes$(): Observable<number> { return this.likes?.counter$; }

  /** The currently authenticated userId or 'unknown' */
  public get me(): string { return this.auth.userId || 'unknown'; }

  constructor(db: DatabaseService, readonly auth: AuthService) { 
    super(db)
  }

  /** Initialize the document  */
  public unwrap(snapshot: DocumentSnapshot<T>): T {

    // Unwraps the base document
    const data = super.unwrap(snapshot);
    if(!snapshot) { return data; }

    // Builds the favorite flag
    this.favorite$ = this.auth.user$.pipe( switchMap( user => user ? this.likers.hasDocument(user.uid) : of(undefined) ) );

    // Gets the collection of likers
    this.likers = this.collection('likers');

    // Gets the likes distributed counter
    this.likes = this.counter('likes');

    // Returns the data payload
    return data;
  }

  /** Toggles the favorite status */
  public toggleFavorite() {

    // Skips whenever ths user isn't authenticated
    if(!this.auth.authenticated) { return; }

    // Resolves the favorite flag to act upon it
    this.favorite$.pipe( take(1) ).subscribe( favorite => {

      // Removes the user from the collection of likers....
      if(favorite) { this.likers.document(this.me).delete(); }
      // ...or adds it according to the favorite flag status
      else { this.likers.document(this.me).set({}); }

      // Updates the likes counter accordingly
      this.likes.update( favorite ? -1 : 1 );      
    });
  }

  /** Deletes the likable document wiping the likes/likers collections too */
  public delete() {

    return Promise.all([
      // Wipes the likes counter
      this.likes.wipe(),       
      // Wipes the likers collection 
      this.likers.wipe(),
      // Deletes the post
      super.delete()
    ]) as unknown as Promise<void>;
  }
}