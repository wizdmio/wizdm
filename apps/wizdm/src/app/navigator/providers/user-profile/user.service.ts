import { DatabaseDocument, DocumentData } from '@wizdm/connect/database/document';
import { DatabaseService } from '@wizdm/connect/database';
import { AuthService, User as authUser} from '@wizdm/connect/auth';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { switchMap, tap, shareReplay } from 'rxjs/operators';

export interface UserData extends DocumentData {

  name?     : string;
  lastName? : string;
  email?    : string;
  photo?    : string;
  phone?    : string;
  birth?    : string;
  gender?   : string;
  bio?      : string;
  lang?     : string;
  location? : string;

  userName? : string;

  searchIndex?: string[];
};

@Injectable({
  providedIn: 'root'
})
export class UserProfile<T extends UserData = UserData> extends DatabaseDocument<T> implements OnDestroy {

  /** User profile data observable */
  readonly data$: Observable<T>;

  /** Current user profile snapshot */
  private snapshot: T = {} as T;
  private sub: Subscription;

  /** The authenticated user's id */
  public get uid(): string { return this.auth.userId; } 

  /** The user's profile data snapshot */
  public get data(): T { return this.snapshot; }
  
  constructor(readonly auth: AuthService, db: DatabaseService) {
    // Extends the DatabaseDocument with a null reference
    super(db, null);

    this.data$ = this.auth.user$.pipe(
      // Resolves the authenticated user attaching the corresponding document reference    
      tap( user => this.fromUser(user) ),
      // Streams the document with the authenticated user profile
      switchMap( user => !!user ? super.stream() : of(null) ),
      // Replays the value to avoid multiple database reads if unnecessary
      shareReplay({ bufferSize: 1, refCount: false }) 
    );

    // Persists the user profile snapshot making sure the document reference is always up to date
    this.sub = this.data$.subscribe( profile => this.snapshot = profile || {} as T);
  }

  // Disposes of the subscription
  ngOnDestroy() { this.sub.unsubscribe(); }

  // Creates the firestore document reference from the User object 
  private fromUser(user: authUser): this {

    // Updates the user profile's reference
    return this.from(!!user ? `users/${user.uid}` : null), this;
  }

  /** Creates the user profile from a User object */
  public register(user: authUser): Promise<void> {

    if(!user) { return Promise.reject( new Error("Can't create a profile from a null user object") ); }

    console.log("Creating user profile for: ", user.email);

    // Checks for document existance first
    return this.fromUser(user).exists().then( exists => {

      if(exists) { return Promise.resolve(); }

      const displayName = (user.displayName || '').split(' ');
      
      return this.set({
        // Inherits the basics from the user object
        name: displayName[0],
        lastName: displayName[1] || '',
        email: user.email,
        photo: user.photoURL,
        // Applies the current locale as the user's language
        lang: this.auth.locale,
        // Builds the search index
        searchIndex: this.searchIndex( user.displayName )
      } as T);
    });
  }

  // Extends the update function to include the search index
  public update(data: T): Promise<void> {

    // Formats the user name properly 
    if(data.userName) { data.userName = this.formatUserName(data.userName); }

    // Computes the search index
    if(data.name || data.lastName) { 
      data.searchIndex = this.searchIndex(`${data.name} ${data.lastName}`); 
    }

    // Updates the profile
    return super.update(data);
  }

  public formatUserName(userName: string): string {
    return userName.replace(/\s*/g, '').toLowerCase();
  }

  /** Build a simple search index based on the user name */
  public searchIndex(name: string): string[] {

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