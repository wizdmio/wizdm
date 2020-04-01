import { Injectable, OnDestroy } from '@angular/core';
import { AuthService, User } from '@wizdm/connect/auth';
import { DatabaseService, DatabaseDocument, DatabaseCollection, dbCommon } from '@wizdm/connect/database';
import { Observable, Subscription, of } from 'rxjs';
import { switchMap, tap, map } from 'rxjs/operators';

export interface dbUser extends dbCommon {
  name?    : string;
  email?   : string;
  photo?   : string;
  phone?   : string;
  birth?   : string;
  gender?  : string;
  motto?   : string;
  lang?    : string;

  searchIndex?   : string[];
};

@Injectable({
  providedIn: 'root'
})
export class Member<T extends dbUser = dbUser> extends DatabaseDocument<T> implements OnDestroy {

  /** Current user profile snapshot */
  private snapshot: T = null;
  private sub: Subscription;

  /** The authenticated user's id */
  public get uid(): string { return this.auth.userId; } 

  /** The user's profile data  */
  public get data(): T { return this.snapshot || {} as T; }

  /** The user's bookmarks collection */
  public get bookmarks() { return this._bookmarks; }
  private _bookmarks: DatabaseCollection<dbCommon>;
  
  constructor(readonly auth: AuthService, db: DatabaseService) {
    // Extends the DatabaseDocument with a null reference
    super(db, null);

    // Persists the user profile snapshot making sure the document reference is always up to date
    this.sub = this.stream().subscribe( profile => this.snapshot = profile );
  }

  // Disposes of the subscription
  ngOnDestroy() { this.sub.unsubscribe(); }

  // Creates the firestore document reference from the User object 
  private fromUser(user: User): this {

    // Updates the user profile's reference
    this.ref = !!user ? this.db.doc(`users/${user.uid}`) : null;
    
    // Updates the bookmarks collection too
    this._bookmarks = this.ref ? this.collection('bookmarks') : null;
    
    return this;
  }

  // Extends the streaming function to resolve the authenticated user first
  public stream(): Observable<T> {

     return this.auth.user$.pipe(
      // Resolves the authenticated user attaching the corresponding document reference    
      tap( user => this.fromUser(user) ),
      // Streams the document with the authenticated user profile
      switchMap( user => !!user ? super.stream() : of(null) )
    );
  }

  /** Creates the user profile from a User object */
  public register(user: User): Promise<void> {

    if(!user) { return Promise.reject( new Error("Can't create a profile from a null user object") ); }

    console.log("Creating user profile for: ", user.email);

    // Checks for document existance first
    return this.fromUser(user).exists()
      // Sets the document content whenever missing
      .then( exists => !exists ? this.set({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          searchIndex: this.searchIndex( user.displayName )
        } as T) : null
      );
  }

  // Extends the delete function to wipe the bookmarks too
  /*public delete(): Promise<void> {

    // Wipes the bookmarks first
    // DONT FORGET TO ADD THE SECURITY RULES TO LET THE USER WIPE THE BOOKMARK COLLECTION
    return this.bookmarks.wipe()
      // Deletes the profile document last
      .then( () => super.delete() );
  }*/

  // Extends the update function to include the search index
  public update(data: T): Promise<void> {

    // Computes the new search index
    const searchIndex = this.searchIndex(data.name);
    // Updates the profile
    return super.update({...data, searchIndex });
  }

  /** Build a simple search index based on the user name */
  private searchIndex(name: string): string[] {

    if(!name) { return [""]; }

    return name
      .toLowerCase()
      .replace(/^\s+|\s+$/g,'')
      .split(/\s/)
      .reduce( (out, token) => {
        // Splits the token in UTF-16 compatible substrings.
        let sub = "";        
        for(let ch of token) {

          sub += ch;
          // Adds the subscring provided is unique
          if(out.findIndex( index => index === sub ) < 0) {
            out.push(sub);
          }
        }

        return out;
      }, []);
  }

  // BOOKMARKS handling

  public isBookmarked(id: string): Observable<boolean> {
    // Streams for all the documents matching the given id
    return this.bookmarks.stream( ref => ref.where(this.db.sentinelId, "==", id || 'nothing') )
      // Returns true whenever there's a document
      .pipe( map( docs => docs.length > 0 ) );
  }
  
  /** Adds a bookmark */
  public addBookmark(id: string): Promise<void> {
    return this.bookmarks.document(id).set({});
  }

  /** Removes a bookmark */
  public removeBookmark(id: string): Promise<void> {
    return this.bookmarks.document(id).delete();
  }
}