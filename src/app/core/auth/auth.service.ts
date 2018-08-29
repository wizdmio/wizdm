import { Injectable, Inject, OnDestroy } from '@angular/core';
import { DatabaseService, QueryFn } from '../database/database.service';
import { UploaderService } from '../uploader/uploader.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth, User } from 'firebase';
import { USER_PROFILE, wmUser } from '../interfaces';
import { Observable, of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private user: User = null;
  private sub: Subscription;

  constructor(@Inject(USER_PROFILE) 
              private profile  : wmUser,
              public  afire2   : AngularFireAuth,
              private database : DatabaseService,
              private uploader : UploaderService) {

    // Subscribes to authStae observable keeping track of auth state changes
    this.sub = this.user$.pipe( 
      switchMap( user => {

        // Keeps a snapshot of user auth state
        this.user = user;

        // Turns it into the user profile data observable
        return user ? this.database.document$<wmUser>(`users/${user.uid}`) : of(null);
      })
      // Save the profile in the local storage
      //tap(data => localStorage.setItem('user', JSON.stringify(data))),
      // Always start with the local stora copy of the profile to avoid flickering
      //startWith(JSON.parse(localStorage.getItem('user'))) )

    // Keeps a snapshot of user profile data
    ).subscribe( data => { Object.assign(this.profile, data || { id: this.user.uid } ); });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  get user$(): Observable<User|null> {
    return this.afire2.user;
  }

  get profile$(): Observable<wmUser|null> {
    return this.user$.pipe(
      switchMap( user => 
        user ? this.database.doc<wmUser>(`users/${user.uid}`).valueChanges() : of(null) 
      )
    );
  }

  // Returns true if user is logged in and profile data are available
  get authenticated(): boolean {
    return this.user !== null && this.profile !== null;
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
    return this.user !== null ? this.profile : {};
  }

  private updateUserData(user: User, lang: string = undefined): Promise<void> {

    // Update user profile data with User Auth and custom data
    let data = {  
      name  : user.displayName,
      email : user.email,
      phone : user.phoneNumber,
      img   : user.photoURL,
      lang  : lang
    };
    
    return this.database.upsert<wmUser>(`users/${user.uid}`, data);
  }

  public updateUserProfile(data: wmUser | any) : Promise<void> {
    return this.database.merge<wmUser>(`users/${this.userId}`, data);
  }

  public loadUserImage(file: File): Promise<void> {
    return this.uploader.uploadUserFileOnce(file)
      .then( file => this.updateUserProfile({ img: file.url }) );
  }

  public registerNew(email: string, password: string, name: string = "", lang: string = undefined): Promise<void> {
    
    console.log("Registering a new user: " + email);

    // Create a new user with email and password
    return this.afire2.auth.createUserWithEmailAndPassword(email, password)
      .then( credential => {

        // Update user profile data with User Auth and custom data
        return this.updateUserData({...credential.user, displayName: name}, lang);
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
    return this.applyUserLanguage() ? 

      // Sends email verification
      this.user.sendEmailVerification( url ? { url } : undefined ) : Promise.resolve();
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
        return this.updateUserData(credential.user, lang);
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

        // Deletes the user's uploaded files first
        return this.uploader.deleteAllUserFiles()

          // Deletes the user profile data next
          .then( () => this.database.delete<wmUser>(`users/${this.userId}`) )
          
          // Finally deletes the account and sign-out
          .then( () => this.user.delete() );
      });
  }
}
