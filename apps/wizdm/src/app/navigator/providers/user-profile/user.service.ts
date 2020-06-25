import { DatabaseDocument, DocumentData } from '@wizdm/connect/database/document';
import { switchMap, tap, shareReplay } from 'rxjs/operators';
import { DatabaseService } from '@wizdm/connect/database';
import { AuthService, User } from '@wizdm/connect/auth';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { authorized } from '@wizdm/admin';
import { rootEmail } from 'env/secrets';

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
  fullName? : string;
  searchIndex?: string[];
};

@Injectable({
  providedIn: 'root'
})
export class UserProfile<T extends UserData = UserData> extends DatabaseDocument<T> implements OnDestroy {

  /** User profile data observable */
  readonly data$: Observable<T>;
  readonly admin$: Observable<boolean>;

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

    this.admin$ = this.auth.user$.pipe( authorized(['admin'], rootEmail) );

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
  private fromUser(user: User): this {

    // Updates the user profile's reference
    return this.from(!!user ? `users/${user.uid}` : null), this;
  }

  /** Creates the user profile from a User object */
  public register(user: User): Promise<void> {

    if(!user) { return Promise.reject( new Error("Can't create a profile from a null user object") ); }

    console.log("Creating user profile for: ", user.email);

    // Checks for document existance first
    return this.fromUser(user).exists().then( exists => {

      if(exists) { return Promise.resolve(); }
      
      // Inherits the basics from the user object
      return this.set( this.userData(user) );
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
    } as T)
  }

  // Extends the update function to properly format the user data
  public update(data: T): Promise<void> {

    // Updates the profile
    return super.update( this.formatData(data)) ;
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

  /** Build a simple search index based on the user name */
  public searchIndex(value: string): string[] {

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
}