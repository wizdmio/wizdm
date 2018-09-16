import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase';
import { Observable, Subscription } from 'rxjs';
//--
export { User } from 'firebase';
export interface UserExtension {
  onUserCreate: (user: User) => boolean | Promise<boolean>,
  onUserDelete: (user: User) => boolean | Promise<boolean>
}

@Injectable()
export class AuthService implements OnDestroy {

  public user: User = null;
  private sub: Subscription;
  
  get user$(): Observable<User|null> {
    return this.fire.user;
  }
  
  constructor(readonly fire: AngularFireAuth) {
    // Keeps a snapshot of the current user object
    this.sub = this.user$.subscribe( user => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return !!this.user;
  }

  // User id helper
  get userId(): string {
    return this.authenticated ? this.user.uid : '';
  }

   // Email verified helper
  get emailVerified(): boolean {
    return this.authenticated ? this.user.emailVerified : false;
  }

  set language(code: string) {
    this.fire.auth.languageCode = code;
  }

  get language(): string {
    return this.fire.auth.languageCode;
  }

  // User Extension support
  private userExtension: UserExtension;

  public extendUser(ext: UserExtension): void {
    this.userExtension = ext;
  }

  private extensionCreate(user: User): Promise<boolean> {
    
    const result = !!this.userExtension && this.userExtension.onUserCreate 
      ? this.userExtension.onUserCreate(user) : true;

    return typeof result === 'boolean' ? Promise.resolve(result) : result;
  }

  private extensionDelete(user: User): Promise<boolean> {
    
    const result = !!this.userExtension && this.userExtension.onUserDelete 
      ? this.userExtension.onUserDelete(user) : true;

    return typeof result === 'boolean' ? Promise.resolve(result) : result;
  }

  /**
   * Registers a new user
   */
  public registerNew(email: string, password: string, name: string = ""): Promise<boolean> {
    
    console.log("Registering a new user: " + email);

    // Create a new user with email and password
    return this.fire.auth.createUserWithEmailAndPassword(email, password)
      .then( credential => {
        // Update the user info with the given name
        return credential.user.updateProfile({ displayName: name } as User)
          // Call the extension create function
          .then( () => this.extensionCreate(credential.user) );
      });
  }

  /**
   * Sends an email verification
   */
  public sendEmailVerification(url?: string): Promise<void> {

    console.log("Send email veriication");
    
    return this.authenticated ? 
      this.user.sendEmailVerification( url ? { url } : undefined ) 
        : Promise.resolve();
  }

  public applyActionCode(code: string): Promise<void> {

    console.log("Applying action with code: " + code);
    // Applies the received action code
    return this.fire.auth.applyActionCode(code);
  }

  public updateEmail(password: string, newEmail: string): Promise<void> {
    
    const email = this.user.email;
    console.log("Updating user email for: ", email);
    // Gets fresh credentials for the current user
    const credential = auth.EmailAuthProvider.credential(email, password);
    // Re-authenticate the user with the fresh credentials
    return this.user.reauthenticateAndRetrieveDataWithCredential(credential)
      .then( credential => {
        // Update the email
        return credential.user.updateEmail(newEmail);
      });
  }

  public updatePassword(password: string, newPassword: string): Promise<void> {
    
    const email = this.user.email;
    console.log("Updating user password for: ", email);
    // Gets fresh credentials for the current user
    const credential = auth.EmailAuthProvider.credential(email, password);
    // Re-authenticate the user with the fresh credentials
    return this.user.reauthenticateAndRetrieveDataWithCredential(credential)
      .then( credential => {
        // Update the password
        return credential.user.updatePassword(newPassword);
      });
  }

  public signIn(email: string, password: string): Promise<any>  {
    
    console.log("Signing in as: " + email);

    return this.fire.auth.signInWithEmailAndPassword(email, password);
  }

   public forgotPassword(email: string, lang?: string, url?: string): Promise<void> {
    
    console.log("Resetting the password for: " + email);
    // Send a password reset email
    return this.authenticated ? 
      this.fire.auth.sendPasswordResetEmail(email, url ? { url } : undefined ) 
        : Promise.resolve();
  }

   public resetPassword(code: string, newPassword: string): Promise<void> {

    console.log("Confirming the password with code: " + code);
    // Resets to a new password applying the received activation code
    return this.fire.auth.confirmPasswordReset(code, newPassword);
  }

  public signInWith(provider: string): Promise<boolean> {

    console.log("Signing-in using: " + provider);

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
        code: 'auth/unsupportedProvider',
        message: 'Unsupported provider'
      });
    }

    return this.fire.auth.signInWithPopup(authProvider)
      .then( credential => this.extensionCreate(credential.user) );
  }

  public signOut(): Promise<void> {
    console.log("Signing-out");
    return this.fire.auth.signOut();
  }

  /**
   * Deletes the user account
   * @param password the user password to confirm deletion
   * @param dispone an optionl function invoked during the process to dispose for other user related resources
   */
  public deleteUser(password: string): Promise<void> {

    const email = this.user.email;
    console.log("Deleting the user ", email);

    // Gets fresh credentials for the current user
    let credential = auth.EmailAuthProvider.credential(email, password);
    // Re-authenticate the user with the fresh credentials
    return this.user.reauthenticateAndRetrieveDataWithCredential(credential)
      .then( credential => { 
        // Invokes the extendion disposing function
        return this.extensionDelete(credential.user)
          .then( success => {
            // Prevents the user deletion reporting the error 
            if(!success) {
              return Promise.reject({ 
                code: 'auth/unableDispose', 
                message: 'Unable to dispose'
              }); 
            }
          // Pass along the credential for the user to be deleted
          return Promise.resolve(credential);
        });
    })
    // Deletes the account and sign-out
    .then( credential => credential.user.delete() );
  }
}
