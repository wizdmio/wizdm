import { Injectable, Inject, NgZone } from '@angular/core';
import { APP, FirebaseApp } from '@wizdm/connect';
import { auth, User } from 'firebase/app';
import { shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

//--
export type FirebaseAuth = auth.Auth;
export type AuthProvider = auth.AuthProvider;
export type IdTokenResult = auth.IdTokenResult;
export { User } from 'firebase/app';

/** Wraps the Firebase Auth as a service */
@Injectable()
export class AuthService {

  /** Authentication states observable */
  readonly state$: Observable<User>;

  /** User observable, includes id token refreshes */
  readonly user$: Observable<User>;

  /** inner Firebase Auth instance */
  readonly auth: FirebaseAuth;

  constructor(@Inject(APP) app: FirebaseApp, zone: NgZone) {

    // Gets the firebase Auth instance
    this.auth = zone.runOutsideAngular( () => app.auth() );

    // Builds the authentication state observable (sign-in/out)
    this.state$ = new Observable<User>(subscriber => this.auth.onAuthStateChanged(
      // Runs the observable within the Angular's zone
      (value: User) => zone.run( () => subscriber.next(value) ),
      // Runs the observable within the Angular's zone
      (error: any) => zone.run( () => subscriber.error(error) ),
      // Runs the observable within the Angular's zone
      () => zone.run( () => subscriber.complete() )

    )).pipe( shareReplay({ bufferSize: 1, refCount: false }) );

    // Builds the user observable (this includes it token refreshes)
    this.user$ = new Observable<User>(subscriber => this.auth.onIdTokenChanged(
      // Runs the observable within the Angular's zone
      (value: User) => zone.run( () => subscriber.next(value) ),
      // Runs the observable within the Angular's zone
      (error: any) => zone.run( () => subscriber.error(error) ),
      // Runs the observable within the Angular's zone
      () => zone.run( () => subscriber.complete() )

    )).pipe( shareReplay({ bufferSize: 1, refCount: false }) );
  }

  /** Current user object snapshot */
  public get user(): User { 
    return this.auth.currentUser; 
  }
  
  /** Returns true if user is logged in */
  public get authenticated(): boolean {
    return !!this.user;
  }

  /** Returns the current user id, when authenticated */
  public get userId(): string {
    return this.authenticated ? this.user.uid : '';
  }

  /** Returns the provider id the current user authenticated with */
  public getProviderId(): Promise<string> {
    // Resolves to '' when not authenticated
    if(!this.authenticated) { return Promise.resolve(''); }
    // Provides the id token result's related provider
    return this.user.getIdTokenResult().then( result => result.signInProvider );
  }

  /** Sets/Gets the code for the language to be used during the authentication */
  public get locale(): string { return this.auth.languageCode; }
  public setLocale(code: string) { this.auth.languageCode = code; }

  /**
   * Registers a new user by email and confirmPasswordReset
   * @param email the email to register with
   * @param password the secret password
   * @param name (optional) the user name
   * @returns the authenticated User object
   */
  public registerNew(email: string, password: string, displayName: string = ""): Promise<User> {
    
    console.log("Registering a new user: " + email);
    // Create a new user with email and password
    return this.auth.createUserWithEmailAndPassword(email, password)
      // Update the user info with the given name
      .then( credential => credential.user.updateProfile({ displayName })
        // Returns the updated User object
        .then( () => credential.user )
      );
  }

  /**
   * Signs in with the given user email and password
   * @param email the email to register with
   * @param password the secret password 
   * @returns the authenticated User object
   */
  public signIn(email: string, password: string): Promise<User>  {
    
    console.log("Signing in as: ", email);

    return this.auth.signInWithEmailAndPassword(email, password)
      .then( credential => credential.user );
  }

  /** Initializes the requested provider for further use */
  public setupProvider(providerId: string): AuthProvider {

    switch(providerId) {

      case 'google': case 'google.com':
      return new auth.GoogleAuthProvider();

      case 'facebook': case 'facebook.com':
      return new auth.FacebookAuthProvider();
 
      case 'twitter': case 'twitter.com':
      return new auth.TwitterAuthProvider();
      
      case 'github': case 'github.com':
      return new auth.GithubAuthProvider();
    }

    return null;
  }

  /** 
   * Signs in using the given provider 
   * @param provider the name of the provider to sign in with
   * @returns the authenticated User object
   */
  public signInWith(providerId: string): Promise<User> {

    console.log("Signing-in using: ", providerId);

    // Setup the provider 
    const authProvider = this.setupProvider(providerId);
    if(authProvider === null) {
      return Promise.reject({
        code: 'auth/unsupported-provider',
        message: 'Unsupported provider'
      });
    }

    // Authenticate the user with the provider
    return this.auth.signInWithPopup(authProvider)
      .then( credential => credential.user );
  }

  /** 
   * Refreshes the current authentication repeating the secret password 
   * @param password the secret password 
   * @returns the authenticated User object
   */
  public reauthenticate(password?: string): Promise<User> {

    // Dismiss the re-authentication attempt whenever the user isn't authenitcated
    if(!this.authenticated) { 
      return Promise.reject({
        code: 'auth/user-not-authenticated',
        message: 'User not authenticated'
      });
    }

    // Checks the provider the user lastly authenticated with
    return this.user.getIdTokenResult().then( result => {

      if(result.signInProvider !== 'password') {

        // Setup the provider 
        const authProvider = this.setupProvider(result.signInProvider);
        if(authProvider === null) {
          return Promise.reject({
            code: 'auth/unsupported-provider',
            message: 'Unsupported provider'
          });
        }

        // Re-authenticate the user with the same provider
        return this.user.reauthenticateWithPopup(authProvider)
          .then( credentials => credentials.user );  
      }

      console.log("Refreshing authentication: ", this.user.email);
      // Gets fresh credentials for the current user
      const credential = auth.EmailAuthProvider.credential(this.user.email, password);
      // Re-authenticate the user with the fresh credentials
      return this.user.reauthenticateWithCredential(credential)
        .then( credential => credential.user ); 
    });
  }

  /** Signs out */
  public signOut(): Promise<void> {
    
    console.log("Signing-out");
    return this.auth.signOut();
  }
  
  /** Applies the received action code to complete the requested action */
  public applyActionCode(code: string): Promise<void> {

    console.log("Applying action with code: ", code);
    return this.auth.applyActionCode(code);
  }

  /**
   * Sends an email to the user to resets the account password
   * @param url (optional) the link to be passed as the continueUrl query parameter
   */
  public sendPasswordResetEmail(email: string, url?: string): Promise<void> {
    
    console.log("Resetting the password for: ", email);
    return this.auth.sendPasswordResetEmail(email, url ? { url } : undefined );
  }

  /** Confirms the new password completing a reset */
  public confirmPasswordReset(code: string, newPassword: string): Promise<void> {

    console.log("Confirming the password with code: ", code);
    return this.auth.confirmPasswordReset(code, newPassword);
  }
}