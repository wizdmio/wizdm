import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth, User } from 'firebase';
import { Observable } from 'rxjs';

import { ContentManager } from 'app/core/content';

//export { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private content: ContentManager,
              public afAuth: AngularFireAuth) { }

  public get user(): Observable<User|null> {
    return this.afAuth.user;
  }

  registerNew(email: string, password: string, name: string = ""): Promise<any> {
    console.log("Registering a new user: " + email);
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  signIn(email: string, password: string): Promise<any>  {
    console.log("Signing in as: " + email);
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  resetPassword(email: string) {
    console.log("Resetting the password for: " + email);
  }

  signInWith(provider: string): Promise<any> {
    
    // Instruct firebase to use the same locale of the content manager
    this.afAuth.auth.languageCode = this.content.language.lang;

    console.log("Signing-in using: " + provider + " [" + this.content.language.lang + "]");

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
    this.afAuth.auth.signOut();
  }
}
