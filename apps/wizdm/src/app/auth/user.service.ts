import { DatabaseDocument, DocumentData } from '@wizdm/connect/database/document';
import { DatabaseService } from '@wizdm/connect/database';
import { AuthService, User as authUser} from '@wizdm/connect/auth';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

export interface UserData extends DocumentData {
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
export class UserProfile<T extends UserData = UserData> extends DatabaseDocument<T> implements OnDestroy {

  /** Current user profile snapshot */
  private snapshot: T = null;
  private sub: Subscription;

  /** The authenticated user's id */
  public get uid(): string { return this.auth.userId; } 

  /** The user's profile data  */
  public get data(): T { return this.snapshot || {} as T; }
  
  constructor(readonly auth: AuthService, db: DatabaseService) {
    // Extends the DatabaseDocument with a null reference
    super(db, null);

    // Persists the user profile snapshot making sure the document reference is always up to date
    this.sub = this.stream().subscribe( profile => this.snapshot = profile );
  }

  // Disposes of the subscription
  ngOnDestroy() { this.sub.unsubscribe(); }

  // Creates the firestore document reference from the User object 
  private fromUser(user: authUser): this {

    // Updates the user profile's reference
    this.ref = !!user ? this.db.doc(`users/${user.uid}`) : null;
    
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
  public register(user: authUser): Promise<void> {

    if(!user) { return Promise.reject( new Error("Can't create a profile from a null user object") ); }

    console.log("Creating user profile for: ", user.email);

    // Checks for document existance first
    return this.fromUser(user).exists()
      // Sets the document content whenever missing
      .then( exists => !exists ? this.set({
          // Inherits teh basics from the user object
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          // Applies the current locale as the user's language
          lang: this.auth.locale,
          // Builds the search index
          searchIndex: this.searchIndex( user.displayName )
        } as T) : null
      );
  }

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
}