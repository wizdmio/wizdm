import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth, User } from 'firebase';
import { Observable } from 'rxjs';

//export { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public get user(): Observable<User|null> {
    return this.afAuth.user;
  }
  
  constructor(private afAuth: AngularFireAuth) {}
  
  registerNew(email: string, password: string, name: string = ""): Promise<any> {
    
    console.log("Registering a new user: " + email);

    // Create a new user with email and password
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then( credential => {

        // Once the user is registered updates the profile with the given name...
        return (credential.user as User).updateProfile({ displayName: name, photoURL: undefined })

          //...and returns the updated UserCredential 
          .then(() => credential);
    });
  }

  signIn(email: string, password: string): Promise<any>  {
    console.log("Signing in as: " + email);
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  resetPassword(email: string) {
    console.log("Resetting the password for: " + email);
  }

  signInWith(provider: string, lang: string = undefined): Promise<any> {
  
    if(lang) {
      // Instruct firebase to use a specific language
      this.afAuth.auth.languageCode = lang;
    }

    console.log("Signing-in using: " + provider);

    switch(provider) {

      case 'google':
      return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());

      case 'facebook':
      return this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());
      
      case 'twitter':
      return this.afAuth.auth.signInWithPopup(new auth.TwitterAuthProvider());

      case 'github':
      return this.afAuth.auth.signInWithPopup(new auth.GithubAuthProvider());

      case 'linkedin':// TODO
      break;
    }

    return Promise.reject({
      code: 'auth/unsupported',
      message: 'Unsupported provider'
    });
  }

  signOut() {
    console.log("Signing-out");
    this.afAuth.auth.signOut();
  }
}
