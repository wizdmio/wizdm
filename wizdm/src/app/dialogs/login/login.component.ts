import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, Inject } from '@angular/core';
import { RedirectService } from '@wizdm/redirect';
import { GtagService } from '@wizdm/gtag';
import { User } from '@wizdm/connect/auth';
import { UserProfile } from 'app/utils/user';
import { $animations } from './login-animations';
import type { ActionData } from '@wizdm/actionlink';

export type loginAction = 'social'|'register'|'signIn'|'forgotPassword'|'resetPassword'|'changePassword'|'sendEmailVerification'|'verifyEmail'|'recoverEmail'|'changeEmail'|'delete';

export interface LoginData extends ActionData { 
  mode?: loginAction;
  code?: string;
  url?: string;
};

@Component({
  selector : 'wm-login-dlg',
  templateUrl : './login.component.html',
  styleUrls : ['./login.component.scss'],
  animations: $animations
})
export class LoginComponent {
  
  readonly form: FormGroup;

  private name: FormControl;
  private email: FormControl;
  private password: FormControl;
  private newEmail: FormControl;
  private newPassword: FormControl;  
  
  public errorCode = null;
  public progress = false;
  public showPassword = false;
  public page: loginAction;

  get auth() { return this.user.auth; }
  
  constructor(@Inject(MAT_DIALOG_DATA) private data: LoginData, private ref: MatDialogRef<LoginData, User>, private user: UserProfile, private gtag: GtagService, private redirect: RedirectService/*, private actionLink: ActionLinkObserver*/) {

    // Individual form controls
    this.name = new FormControl(null, Validators.required);
    this.email = new FormControl(null, [Validators.required, Validators.email]);
    this.password = new FormControl(null, Validators.required);
    this.newEmail = new FormControl(null, [Validators.required, Validators.email]);
    this.newPassword = new FormControl(null, Validators.required);

    // Empty form group
    this.form = new FormGroup({});

    // Gets the requested loginAction, if any
    const mode = data && data.mode;

    // Populates the form according to the requested action
    this.switchPage(mode || 'social');
    
    // Applies the one time code confirmation (if any) on opening 
    this.ref.afterOpened().subscribe(() => {
      // Allows verifyEmail and recoverEmail only
      if(mode === 'verifyEmail' || mode === 'recoverEmail') {
        // Applies the one-time code confirmation
        this.auth.applyActionCode(data && data.code)
          // Refreshes the current user
          .then( () => this.auth.user.reload() )
          // Dispays the error code, eventually
          .catch( error => this.showError(error.code) );
      }
    });
    
    // Navigates towards the data url on closing
    this.ref.beforeClosed().subscribe( () => this.navigate(data.url) );
  }

  private switchPage(page: loginAction) {

    // Resets the status
    this.showPassword = this.progress = false;
    this.errorCode = null;

    // Removes all the controls from the form group
    Object.keys(this.form.controls).forEach( control => {
      this.form.removeControl(control);
    });
    
    // Add the relevant controls to the form according to selected page
    switch(this.page = page) {

      case 'social': break;

      case 'register':
      this.form.addControl('name', this.name);
      this.form.addControl('email', this.email);
      this.form.addControl('password', this.password);
      break;

      case 'signIn':
      this.form.addControl('email', this.email);
      this.form.addControl('password', this.password);      
      break;

      case 'forgotPassword':
      this.form.addControl('email', this.email);
      break;

      case 'resetPassword':
      this.form.addControl('newPassword', this.newPassword);
      break;

      case 'changePassword':
      this.form.addControl('password', this.password);
      this.form.addControl('newPassword', this.newPassword);
      break;

      case 'changeEmail':
      this.form.addControl('password', this.password);
      this.form.addControl('newEmail', this.newEmail);
      break;

      case 'sendEmailVerification':
      case 'verifyEmail':
      case 'recoverEmail':
      break;

      case 'delete':
      // Gets the provider the user authenticated with
      this.auth.getProviderId().then( provider => {

        // Asks for the password, eventually
        if(provider == 'password') {

          this.form.addControl('password', this.password);
        }
      });
      break;

      default:
      console.error('Invalid login page requested:', page);
    }
  }

  /**
   * Shows the error message
   * @param error code of the error
   */
  private showError(error: string) {
    // Stops the progress, if any
    this.progress = false;
    // Sets the error code to be displayed
    this.errorCode = error;
    // Makes sure to turn off the error message after 10s
    setTimeout(() => this.errorCode = null, 10000);
  }

  public activate(action: loginAction) {

    this.progress = true;
    
    switch(action) {

      case 'signIn':
      this.signIn( this.email.value, this.password.value );
      break;

      case 'register':
      this.registerNew( this.email.value, this.password.value, this.name.value );
      break;

      case 'forgotPassword':
      this.forgotPassword( this.email.value );
      break;

      case 'resetPassword':
      this.resetPassword( this.newPassword.value );
      break;

      case 'changePassword':
      this.updatePassword( this.password.value, this.newPassword.value );
      break;

      case 'changeEmail':
      this.updateEmail( this.password.value, this.newEmail.value );
      break;

      case 'sendEmailVerification':
      this.sendEmailVerification();
      break;

      case 'delete':
      this.deleteAccount( this.password.value );
      break;

      case 'verifyEmail': 
      case 'recoverEmail':
      this.ref.close(this.auth.user);
      break;
    }
  }

  // Navigation helper
  private navigate(to?: string) {
    // Resolves to true when no target is specified
    if(!to) { return Promise.resolve(true); }
    // Navigates as requested
    return this.redirect.navigate(to);
  }

  private registerNew(email: string, password: string, name: string) {
    // Registering a new user with a email/password
    this.auth.registerNew(email, password, name )
      .then( user => {
        // Tracks the activity with analytics
        this.gtag.signUp(user?.providerId);
        // Creates the new user user  
        this.user.register(user)
          // Sends the email verification
          .then( () => user.sendEmailVerification() )
          // Closes the dialog returning the user
          .then( () => this.ref.close(user) );
      })
      // Dispays the error code, eventually
      .catch( error => this.showError(error.code) );
  }

  private signIn(email: string, password: string) {
    // Sign-in using email/password
    this.auth.signIn(email, password)
      // Closes the dialog returning the user
      .then( user => {
        // Tracks the activity with analytics
        this.gtag.login(user?.providerId);
        // Closes the dialog 
        this.ref.close(user);        
      })
      // Dispays the error code, eventually
      .catch( error => this.showError(error.code) );
  }

  public signInWith(provider: string) { 
    // Signing-in with a provider    
    this.auth.signInWith( provider )
      .then( user => { 
        // Tracks the activity with analytics
        this.gtag.login(user?.providerId);
        // Creates the new user user if needed, keeps the existing one otherwise 
        this.user.register(user)
          // Closes the dialog returning the user
          .then( () => this.ref.close(user) );
      })
      // Dispays the error code, eventually
      .catch( error => this.showError(error.code) );
  }

  private sendEmailVerification() {
    
    // Grabs the url value passed along with the dialog data. Please note this is a relative url
    const url = this.data && this.data.url || ''; 
    
    // Removes the url from data preventing the redirection while closing the dialog
    if('url' in this.data) { delete this.data.url; } 

    // Sends the email verification request passing along the destination deep url for the user
    // to be redirected towards the desiderd destination once the verification will be completed
    return this.auth.user.sendEmailVerification({ url: window.location.origin + url })
      // Closes the dialog returning null
      .then( () => this.ref.close(null) )
      // Dispays the error code, eventually
      .catch( error => this.showError(error.code) );
  }

  private forgotPassword(email: string) {

    this.auth.sendPasswordResetEmail(email)
      // Closes the dialog returning null
      .then( () => this.ref.close(null) )
      // Dispays the error code, eventually
      .catch( error => this.showError(error.code) );
  }

  private resetPassword(newPassword: string) {

    // Grabs the code value passed along with the dialog data
    const code = this.data && this.data.code || '';
    
    this.auth.confirmPasswordReset(code, newPassword)
      // Closes the dialog returning null
      .then( () => this.ref.close(null) )
      // Dispays the error code, eventually
      .catch( error => this.showError(error.code) );
  }
  
  private updateEmail(password: string, newEmail: string) {
    // Refreshes the authentication
    this.auth.reauthenticate(password).then( user => {
        
      // Updates the email returning the new user object
      user.updateEmail(newEmail)

        .then( () => user.sendEmailVerification() )
      
        .then( () => this.ref.close(user) )
      })
      // Dispays the error code, eventually
      .catch( error => this.showError(error.code) );
  }

  private updatePassword(password: string, newPassword: string) {
    // Refreshes the authentication
    this.auth.reauthenticate(password)
      // Updates the password returning the new user object
      .then( user => user.updatePassword(newPassword).then( () => this.ref.close(user) ) )
      // Dispays the error code, eventually
      .catch( error => this.showError(error.code) );
  }

  private deleteAccount(password?: string) {

    // Refreshes the authentication
    this.auth.reauthenticate(password)
      .then( user => {
        // Navigates home first
        this.navigate('/')
          // Deletes the user user first 
          .then( () => this.user.delete() )
          // Deletes the user object next
          .then( () => user.delete() )
          // Dispays the error code, eventually
          .catch( error => this.showError(error.code) );
      })
      // Closes the dialog returning null
      .then( () => this.ref.close(null) )
      // Dispays the error code, eventually
      .catch( error => this.showError(error.code) );
  }
}  
