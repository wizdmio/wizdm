import { Observable, Subscription, of, from, defer, empty } from 'rxjs';
import { DatabaseCollection } from '@wizdm/connect/database/collection';
import { tap, map, shareReplay, expand, switchMap } from 'rxjs/operators';
import { DocumentData } from '@wizdm/connect/database/document';
import { DatabaseService } from '@wizdm/connect/database';
import { AuthService, User } from '@wizdm/connect/auth';
import { Injectable, OnDestroy } from '@angular/core';
import { tapOnce } from '@wizdm/rxjs';

export interface UserData extends DocumentData {

  name?     : string;
  lastName? : string;
  email?    : string;
  photo?    : string;
  phone?    : string;
  birth?    : string;
  gender?   : string;
  bio?      : string;
  location? : string;

  lang?     : string;
  theme?    : 'auto'|'light'|'dark';

  userName? : string;
  fullName? : string;
  searchIndex?: string[];
};

@Injectable({
  providedIn: 'root'
})
export class UserProfile<T extends UserData = UserData> extends DatabaseCollection<T> implements OnDestroy {
  
  /** User's profile observables map */
  private cache: { [key: string]: Observable<T> } = {}; 

  /** Current user's profile data observables */
  readonly data$: Observable<T>;

  /** Current user profile snapshot */
  private snapshot: T = {} as T;
  private sub: Subscription;

  /** The authenticated user's id */
  public get uid(): string { return this.auth.userId; } 

  /** The user's profile data snapshot */
  public get data(): T { return this.snapshot; }
  
  constructor(readonly auth: AuthService, db: DatabaseService) {
    // Extends the DatabaseCollection
    super(db, 'users');

    // Streams the document with the authenticated user profile
    this.data$ = this.auth.user$.pipe( switchMap(user => this.fromUserId(user?.uid) ) );

    // Persists the user profile snapshot making sure the document reference is always up to date
    this.sub = this.data$.subscribe( profile => this.snapshot = profile || {} as T);
  }

  // Disposes of the subscription
  ngOnDestroy() { this.sub.unsubscribe(); }

  /** Creates the user profile from a User object */
  public register(user: User): Promise<void> {

    if(!user) { return Promise.reject( new Error("Can't create a profile from a null user object") ); }

    console.log("Creating user profile for: ", user.email);

    // Reference the child document
    const document = this.document(user.uid);

    // Checks for document existance first
    return document.exists().then( exists => {

      // Skips whenever the profile already exists, we are likely loggin-in with a third party provider
      if(exists) { return Promise.resolve(); }

      // Creates a user profie dataset from the user object
      const data = this.userData(user);

      // Guesses a possible @username prior to create the new profile
      return this.guessUserName(data.fullName)
        // Creates the new document at last
        .then( userName => document.set({ ...data, userName }));
    });
  }

  /** Formats the user data from a User object  */
  public userData(user: User) {

    return this.formatData({
      // Extracts the first name
      name: (user.displayName || '').replace(/\s.*$/,''),
      // Extracts the last name
      lastName: (user.displayName || '').replace(/^.*\s/, ''),
      // Copies email, phone and photo
      email: user.email || '',
      phone: user.phoneNumber || '',
      photo: user.photoURL || '',
      // Applies the current locale as the user's language
      lang: this.auth.locale

    } as T);
  }

  // Updates the current user's profile
  public update(data: T): Promise<void> {
    
    return this.document(this.uid).update( this.formatData(data) );
  }

  // Deletes the current user's profile
  public delete(): Promise<void> {

    return this.document(this.uid).delete();
  }

  /** Formats the user data */
  public formatData(data: T): T {

    // Formats the user name properly 
    if(data.userName) { data.userName = data.userName.replace(/\s*/g, '').toLowerCase(); }

    // Updates fullName and searchIndex
    if(typeof data.name === 'string') { 

      if(typeof data.lastName === 'undefined') {
        throw new Error("User name and lastName fields must be updated together");
      }

      // Ensures the full name excludes unnecessary spaces
      data.fullName = `${data.name} ${data.lastName}`.replace(/^\s*|\s*$|(\s)\s+/g, '$1');

      // Computes the search index based on a lowered case full name
      data.searchIndex = this.searchIndex(data.fullName.toLowerCase()); 
    }

    return data;
  }

  /** Returns true wheneve the given user name is taken */
  public doesUserNameExists(userName: string, excludeMe?: boolean): Promise<boolean> {

    return this.snap( qf => qf.where('userName', '==', userName.replace(/\s*/g,'') ) )
      .then( docs => docs.length > 0 && (docs[0].id !== this.uid || !excludeMe) );
  }

  /** Guesses a plausible @username from the fullName */
  public guessUserName(fullName: string): Promise<string> {

    // Asserts the validity of the input name
    if(!fullName || fullName.length <=0 ) { 

      return Promise.reject( new Error('Guessing a @username requires a valid full name as input') ); 
    }

    // Creates function to test the @username existance
    const test = (userName: string) => from( this.doesUserNameExists(userName) ).pipe( map(exists => exists ? '' : userName) );

    // Starts by guessing a name
    const guessName = fullName.replace(/[^\w-_]+/g, '-').toLowerCase();

    // Tests the name for existance and recurs until an original name is found
    return test( guessName ).pipe( expand( (name, index) => name ? empty(): test( guessName + index.toString() ) ) ).toPromise();
  }

  /** Build a simple search index based on the user name */
  private searchIndex(value: string): string[] {

    return value && value.split(/\s/).reduce( (out, token) => {
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
      
    }, []) || [""];
  }

  /**  Observes a user from the id */
  public fromUserId(userId: string): Observable<T> {

    // Skips invalid id
    if(!userId) { return of(undefined).pipe( shareReplay({ bufferSize: 1, refCount: false }) ); }

    // Returns the cached observable, if any
    const cached = this.cache[userId];
    if(cached) { return cached; }

    // Streams a new observable from the user's collection caching a copy for further uses
    const streamed = this.cache[userId] = this.document(userId).stream().pipe(

      // Caches the same observable under its @username whenever possible
      tapOnce( data => { data && (this.cache[data.userName || userId] = this.cache[data.userName || userId] || streamed); }),

      map( data => data ),

      // Replays the emission to avoid streaming multiple copies from the database when not needed
      shareReplay({ bufferSize: 1, refCount: false })
    );

    return streamed;
  }

  /**  Observes a user from the userName */
  public fromUserName(userName: string): Observable<T> {

    // Skips invalid user names
    if(!userName) { return of(undefined).pipe( shareReplay({ bufferSize: 1, refCount: false }) ); }

    // Returns the cached observable, if any
    const cached = this.cache[userName];
    if(cached) { return cached; }

    // Streams a new observable from the user's collection acching a copy for further uses
    const streamed = this.cache[userName] = this.stream( qf => qf.where('userName', '==', userName) ).pipe( 

      // Caches the same observable under its uid whenever possible
      tapOnce( users => { users[0] && (this.cache[users[0].id] = this.cache[users[0].id] || streamed); } ),

      // Gets the user's data
      map( users => users[0] ), 

      // Replays the emission to avoid streaming multiple copies from the database when not needed
      shareReplay({ bufferSize: 1, refCount: false })
    );

    return streamed;
  }
}