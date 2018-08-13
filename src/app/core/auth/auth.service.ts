import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { DatabaseService } from '../database/database.service';
import { auth, User } from 'firebase';
import { Observable, of, Subscription } from 'rxjs';
import { switchMap, startWith, tap } from 'rxjs/operators';

export interface wmUser {

  img?    : string,
  name?   : string,
  email?  : string,
  phone?  : string,
  birth?  : string,
  gender? : string,
  motto?  : string,
  lang?   : string,

  id?     : string,
  created? : any,
  updated? : any
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private user: User = null;
  private userData: wmUser = null;
  private sub: Subscription;

  get user$(): Observable<User|null> {
    return this.af.user;
  }

  get userData$(): Observable<wmUser|null> {
    return this.user$.pipe(
      switchMap( user => 
        user ? this.db.doc<wmUser>(`users/${user.uid}`).valueChanges() : of(null) 
      )
    );
  }

  // Returns true if user is logged in and profile data are available
  get authenticated(): boolean {
    return this.user !== null && this.userData !== null;
  }

  // User id helper
  get userId(): string {
    return this.user !== null ? this.user.uid : null;
  }

  // Email verified helper
  get emailVarified(): boolean {
    return this.user !== null ? this.user.emailVerified : false;
  }

  // Returns the user authentication object
  get userAuth(): User {
    return this.user !== null ? this.user : {} as User;
  }

  // Returns the user customized profile data object
  get userProfile(): wmUser {
    return this.user !== null ? this.userData : {};
  }
  
  constructor(public  af: AngularFireAuth,
              private db: DatabaseService) {

    // Subscribes to authStae observable keeping track of auth state changes
    this.sub = this.user$.pipe( 
      switchMap( user => {
        
        // Keeps a snapshot pf user auth state
        this.user = user;
        
        // Turns it into the user profile data observable
        return user ? this.db.doc<wmUser>(`users/${user.uid}`).valueChanges() : of(null);
      })
      // Save the profile in the local storage
      //tap(data => localStorage.setItem('user', JSON.stringify(data))),
      // Always start with the local stora copy of the profile to avoid flickering
      //startWith(JSON.parse(localStorage.getItem('user'))) )

     // Keeps a snapshot of user profile data
    ).subscribe( data => this.userData = data );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private updateUserData(user: User, lang: string = undefined): Promise<void> {

    // Update user profile data with User Auth and custom data
    let data = {  
      name:  user.displayName,
      email: user.email,
      phone: user.phoneNumber,
      img:   user.photoURL,
      lang:  lang
    };
    
    return this.db.upsert<wmUser>(`users/${user.uid}`, data);
  }

  public updateUserProfile(data: wmUser | any) : Promise<void> {
    return this.db.merge<wmUser>(`users/${this.userId}`, data);
  }

  public registerNew(email: string, password: string, name: string = "", lang: string = undefined): Promise<void> {
    
    console.log("Registering a new user: " + email);

    // Create a new user with email and password
    return this.af.auth.createUserWithEmailAndPassword(email, password)
      .then( credential => {

        // Update user profile data with User Auth and custom data
        return this.updateUserData({...credential.user, displayName: name}, lang);
    });
  }

  // Helper to apply the appropriate language locale before starting an auth action
  private applyUserLanguage(lang?: string): boolean {
    
    if(lang || this.authenticated) {
      this.af.auth.languageCode = lang || this.userData.lang;
      return true;
    }
    return false;
  } 

  public sendEmailVerification(url?: string): Promise<void> {

    console.log("Send email veriication");

    // Makes sure to apply the user local language
    return this.applyUserLanguage() ? 

      // Sends email verification
      this.user.sendEmailVerification( url ? { url } : undefined ) : Promise.resolve();
  }

  public applyActionCode(code: string): Promise<void> {

    console.log("Applying action with code: " + code);
    
    // Applies the received action code
    return this.af.auth.applyActionCode(code);
  }

  public updateEmail(password: string, newEmail: string): Promise<void> {
    
    let email = this.user.email;

    console.log("Updating user email for: ", email);

    // Gets fresh credentials for the current user
    let credential = auth.EmailAuthProvider.credential(email, password);
    
    // Re-authenticate the user with the fresh credentials
    return this.user.reauthenticateWithCredential(credential)
      .then( () => {

        // Update the email
        return this.user.updateEmail(newEmail);
      });
  }

  public updatePassword(password: string, newPassword: string): Promise<void> {
    
    let email = this.user.email;

    console.log("Updating user password for: ", email);

    // Gets fresh credentials for the current user
    let credential = auth.EmailAuthProvider.credential(email, password);
    
    // Re-authenticate the user with the fresh credentials
    return this.user.reauthenticateWithCredential(credential)
      .then( () => {

        // Update the password
        return this.user.updatePassword(newPassword);
      });
  }

  public signIn(email: string, password: string): Promise<any>  {
    console.log("Signing in as: " + email);
    return this.af.auth.signInWithEmailAndPassword(email, password);
  }

  public forgotPassword(email: string, lang?: string, url?: string): Promise<void> {
    
    console.log("Resetting the password for: " + email);

    // Applies the requested language and send a password reset email
    return this.applyUserLanguage(lang || 'en') ? 
      this.af.auth.sendPasswordResetEmail(email, url ? { url } : undefined ) : Promise.resolve();
  }

  public resetPassword(code: string, newPassword: string): Promise<void> {

    console.log("Confirming the password with code: " + code);
    
    // Resets to a new password applying the received activation code
    return this.af.auth.confirmPasswordReset(code, newPassword);
  }

  public signInWith(provider: string, lang?: string): Promise<void> {

    console.log("Signing-in using: " + provider);

    // Instruct firebase to use a specific language
    this.applyUserLanguage(lang || 'en');

    let authProvider = null;

    switch(provider) {

      case 'google':
      authProvider = new auth.GoogleAuthProvider();

      case 'facebook':
      authProvider = new auth.FacebookAuthProvider();
      
      case 'twitter':
      authProvider = new auth.TwitterAuthProvider();

      case 'github':
      authProvider = new auth.GithubAuthProvider();

      case 'linkedin':// TODO
      break;
    }

   if(authProvider === null) {
      return Promise.reject({
        code: 'auth/unsupported',
        message: 'Unsupported provider'
      });
    }

    return this.af.auth.signInWithPopup(authProvider)
      .then( credential => {
        // Update user profile data with User Auth and custom data
        return this.updateUserData(credential.user, lang);
      }); 
  }

  public signOut(): void {
    console.log("Signing-out");
    this.af.auth.signOut();
  }

  public deleteUser(password: string): Promise<void> {

    let email = this.user.email;
    
    console.log("Deleting the user ", email);

    // Gets fresh credentials for the current user
    let credential = auth.EmailAuthProvider.credential(email, password);
    
    // Re-authenticate the user with the fresh credentials
    return this.user.reauthenticateWithCredential(credential)
      .then( () => {

        // Deletes the user custom data...
        return this.db.delete<wmUser>(`users/${this.userId}`)
          
          // Then deletes the account and sign-out
          .then( () => this.user.delete() );
      });
  }
}
