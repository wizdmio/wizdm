import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {

  constructor() { }

  registerNew(email: string, password: string, name: string = "") {
    console.log("Registering a new user: " + email);
  }

  signIn(email: string, password: string) {
    console.log("Signing in as: " + email);
  }

  resetPassword(email: string) {
    console.log("Resetting the password for: " + email);
  }

  signInWith(provider: string) {
    console.log("Signing-in using: " + provider);
  }
}