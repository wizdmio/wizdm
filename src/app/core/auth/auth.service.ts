import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { DatabaseService, dbDocument } from '../database/database.service';
import { auth, User } from 'firebase';
import { Observable, of } from 'rxjs';
import { switchMap, startWith, tap } from 'rxjs/operators';

export interface UserData {

  name?  : string,
  email? : string,
  phone? : string,
  img?   : string,
  lang?  : string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authState$: User = null;
  private userData$: UserData = null;
  public  redirectUrl: string = null;

  get authState(): Observable<User|null> {
    return this.afAuth.user;
  }

  get userData(): Observable<UserData|null> {
    return this.authState.pipe(
      switchMap(user => {
        return  user ? this.db.doc<UserData>(`users/${user.uid}`).valueChanges() : of(null);
      })
    );
  }
  
  constructor(public  afAuth: AngularFireAuth,
              private db: DatabaseService) {

    // Keeps a snapshot of the current user auth state
    this.authState.subscribe((auth) => {
      this.authState$ = auth;
    });

    // Keep a snapshot of the customized user profile
    this.userData//.pipe(
      
      // Save the profile in the local storage
      //tap(data => localStorage.setItem('user', JSON.stringify(data))),

      // Always start with the local stora copy of the profile to avoid flickering
      //startWith(JSON.parse(localStorage.getItem('user'))) )

      // Load the user profile and keep a snapshot always in sync
    .subscribe( data => this.userData$ = data );
  }

  private updateUserData(user: User, lang: string = undefined): Promise<boolean> {

    // Update user profile data with User Auth and custom data
    let data = {  
      name:  user.displayName,
      email: user.email,
      phone: user.phoneNumber,
      img:   user.photoURL,
      lang:  lang
    };
    
    return this.db.merge<UserData>(`users/${user.uid}`, data)
      .then(() => true);
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState$ !== null;
  }

  get userId(): string {
    return this.authenticated ? this.authState$.uid : null;
  }

  get userProfile(): UserData {
    return this.userData$;
  }

  registerNew(email: string, password: string, name: string = "", lang: string = undefined): Promise<boolean> {
    
    console.log("Registering a new user: " + email);

    // Create a new user with email and password
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then( credential => {

        // Update user profile data with User Auth and custom data
        return this.updateUserData({...credential.user, displayName: name}, lang);
    });
  }

  signIn(email: string, password: string): Promise<any>  {
    console.log("Signing in as: " + email);
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  resetPassword(email: string): Promise<boolean> {
    console.log("Resetting the password for: " + email);
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  confirmPassword(code: string, password: string): Promise<boolean> {
    // TODO: check how to do so
    //this.afAuth.auth.verifyPasswordResetCode(code);

    console.log("Confirming the password with code: " + code);
    return this.afAuth.auth.confirmPasswordReset(code, password)
  }

  signInWith(provider: string, lang: string = undefined): Promise<boolean> {

    if(lang) {
      // Instruct firebase to use a specific language
      this.afAuth.auth.languageCode = lang;
    }

    console.log("Signing-in using: " + provider);

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

    return this.afAuth.auth.signInWithPopup(authProvider)
      .then( credential => {
        // Update user profile data with User Auth and custom data
        return this.updateUserData(credential.user, lang);
      }); 
  }

  signOut(): void {
    console.log("Signing-out");
    this.afAuth.auth.signOut();
  }
}
