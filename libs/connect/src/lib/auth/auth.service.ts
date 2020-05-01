import { Injectable, Inject, NgZone } from '@angular/core';
import { APP, FirebaseApp } from '../connect.module';
import { shareReplay } from 'rxjs/operators';
import { auth, User } from 'firebase/app';
import { Observable, OperatorFunction } from 'rxjs';
//--
export type FirebaseAuth = auth.Auth;
export { User } from 'firebase/app';

/** Returns an observable mirroring the source while running within the given zone */
export function runInZone<T>(zone: NgZone): OperatorFunction<T, T> {
  return source => {
    return new Observable( observer => {
      return source.subscribe(
        (value: T) => zone.run(() => observer.next(value)),
        (e: any) => zone.run(() => observer.error(e)),
        () => zone.run(() => observer.complete())
      );
    });
  };
}

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
    this.auth = app.auth();

    // Builds the authentication state observable (sign-in/out)
    this.state$ = new Observable<User>(subscriber =>
      // Wraps the onAuthStaeChanged observer
      this.auth.onAuthStateChanged(subscriber)
      // Replay the same result to all subscribers
    ).pipe( /*shareReplay({ bufferSize: 1, refCount: false }),*/ runInZone(zone) );

    // Builds the user observable (this includes it token refreshes)
    this.user$ = new Observable<User>(subscriber => 
      // Wraps the onIdTokenChanged observer
      this.auth.onIdTokenChanged(subscriber)
      // Replay the same result to all subscribers
    ).pipe(/*shareReplay({ bufferSize: 1, refCount: false }),*/ runInZone(zone) );
  }

  /** Current user object snapshot */
  public get user() { 
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

  /** 
   * Refreshes the current authentication repeating the secret password 
   * @param password the secret password 
   * @returns the authenticated User object
   */
  public refresh(password: string): Promise<User> {

    console.log("Refreshing authentication: ", this.user.email);
    // Gets fresh credentials for the current user
    const credential = auth.EmailAuthProvider.credential(this.user.email, password);
    // Re-authenticate the user with the fresh credentials
    return this.user.reauthenticateWithCredential(credential)
      .then( credential => credential.user );
  }

  /** 
   * Signs in using the given provider 
   * @param provider the name of the provider to sign in with
   * @returns the authenticated User object
   */
  public signInWith(provider: string): Promise<User> {

    console.log("Signing-in using: ", provider);

    let authProvider = null;

    switch(provider) {

      case 'google':
      authProvider = new auth.GoogleAuthProvider();
      break;

      case 'facebook':
      authProvider = new auth.FacebookAuthProvider();
      break;
 
      case 'twitter':
      authProvider = new auth.TwitterAuthProvider();
      break;
      
      case 'github':
      authProvider = new auth.GithubAuthProvider();
      break;
      
      case 'linkedin':// TODO
      break;
    }

   if(authProvider === null) {
      return Promise.reject({
        code: 'auth/unsupported-provider',
        message: 'Unsupported provider'
      });
    }

    return this.auth.signInWithPopup(authProvider)
      .then( credential => credential.user );
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