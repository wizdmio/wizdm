import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth, User } from 'firebase';
import { wmUser } from '../interfaces';
import { UserProfile } from '../user/user-profile.service';
import { Observable, of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  get user$(): Observable<User|null> {
    return this.afire2.user;
  }

  public user: User = null;
  private sub: Subscription;

  constructor(private afire2   : AngularFireAuth,
              public  profile  : UserProfile) {

    // Initialize the user profile with the authenticated user token
    this.sub = this.user$.subscribe( user => { 
      this.profile.init(this.user = user);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  get profile$(): Observable<wmUser|null> {
    return this.user$.pipe(
      switchMap(user => this.profile.asObservable(user))
    );
  }

  // Returns true if user is logged in and profile data are available
  get authenticated(): boolean {
    return this.profile.authenticated;
  }

  // User id helper
  get userId(): string {
    return this.user !== null ? this.user.uid : null;
  }

  // Email verified helper
  get emailVerified(): boolean {
    return this.user !== null ? this.user.emailVerified : false;
  }

  private createUserProfile(user: User, lang?: string): Promise<void> {
    return this.profile.create(user, lang);
  }

  public registerNew(email: string, password: string, name: string = "", lang?: string): Promise<void> {
    
    console.log("Registering a new user: " + email);

    // Create a new user with email and password
    return this.afire2.auth.createUserWithEmailAndPassword(email, password)
      .then( credential => {

        // Update user profile data with User Auth and custom data
        return this.createUserProfile({...credential.user, displayName: name}, lang);
    });
  }

  // Helper to apply the appropriate language locale before starting an auth action
  private applyUserLanguage(lang?: string): boolean {
    
    if(lang || this.authenticated) {
      this.afire2.auth.languageCode = lang || this.profile.lang;
      return true;
    }
    return false;
  } 

  public sendEmailVerification(url?: string): Promise<void> {

    console.log("Send email veriication");

    // Makes sure to apply the user local language
    return this.applyUserLanguage()
      // Sends email verification
      ? this.user.sendEmailVerification( url ? { url } : undefined ) 
        : Promise.resolve();
  }

  public applyActionCode(code: string): Promise<void> {

    console.log("Applying action with code: " + code);
    
    // Applies the received action code
    return this.afire2.auth.applyActionCode(code);
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
    return this.afire2.auth.signInWithEmailAndPassword(email, password);
  }

  public forgotPassword(email: string, lang?: string, url?: string): Promise<void> {
    
    console.log("Resetting the password for: " + email);

    // Applies the requested language and send a password reset email
    return this.applyUserLanguage(lang || 'en') ? 
      this.afire2.auth.sendPasswordResetEmail(email, url ? { url } : undefined ) : Promise.resolve();
  }

  public resetPassword(code: string, newPassword: string): Promise<void> {

    console.log("Confirming the password with code: " + code);
    
    // Resets to a new password applying the received activation code
    return this.afire2.auth.confirmPasswordReset(code, newPassword);
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
      return Promise.reject('auth/unsupportedProvider');
    }

    return this.afire2.auth.signInWithPopup(authProvider)
      .then( credential => {
        // Update user profile data with User Auth and custom data
        return this.createUserProfile(credential.user, lang);
      }); 
  }

  public signOut(): void {
    console.log("Signing-out");
    this.afire2.auth.signOut();
  }

  public deleteUser(password: string): Promise<void> {

    let email = this.user.email;
    
    console.log("Deleting the user ", email);

    // Gets fresh credentials for the current user
    let credential = auth.EmailAuthProvider.credential(email, password);
    
    // Re-authenticate the user with the fresh credentials
    return this.user.reauthenticateWithCredential(credential)
      .then( () => {          
        // Delete the user profile first
        return this.profile.delete()
          // Finally deletes the account and sign-out
          .then( () => this.user.delete() );
      });
  }
}
