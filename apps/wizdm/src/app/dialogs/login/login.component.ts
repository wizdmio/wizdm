import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RedirectService } from '@wizdm/redirect';
import { User } from '@wizdm/connect/auth';
import { DialogComponent } from '@wizdm/elements/dialog';
import { Member } from 'app/core/member';
import { $animations } from './login-animations';

export type loginAction = 'register'|'signIn'|'forgotPassword'|'resetPassword'|'changePassword'|'sendEmailVerification'|'verifyEmail'|'recoverEmail'|'changeEmail'|'delete'|'signOut';

export interface LoginData { 
  mode?: loginAction;
  code?: string;
  url?: string;
};

@Component({
  selector : 'wm-login-dlg',
  templateUrl : './login.component.html',
  styleUrls : ['./login.component.scss'],
  host: { 'class': 'wm-login' },
  encapsulation: ViewEncapsulation.None,
  animations: $animations
})
export class LoginComponent extends DialogComponent<LoginData, User> {
  
  readonly form: FormGroup;

  private name: FormControl;
  private email: FormControl;
  private password: FormControl;
  private newEmail: FormControl;
  private newPassword: FormControl;  
  
  public error = null;
  public hide = true;
  public progress = false;

  public page: loginAction;

  get auth() { return this.member.auth; }
  
  constructor(dialog: MatDialog, private member: Member, private redirect: RedirectService) {

    super(dialog);

    this.panelClass = 'wm-login';

    // Form controls
    this.name = new FormControl(null, Validators.required);
    this.email = new FormControl(null, [Validators.required, Validators.email]);
    this.password = new FormControl(null, Validators.required);
    this.newEmail = new FormControl(null, [Validators.required, Validators.email]);
    this.newPassword = new FormControl(null, Validators.required);

    // Empty form group
    this.form = new FormGroup({});
  }

  /** Returns the optional code value passed along with the input data */
  private get code(): string { return this.data && this.data.code || ''; }

  /** Returns the optional url value passed along with the input data */
  private get redirectTo(): string { return this.data && this.data.url || undefined; }

  /** Opens the Login dialog */
  public open(data?: LoginData) {

    // Shortcuts for signing-out
    if(data && data.mode === 'signOut') { return this.signOut(), null; }

    // Shortcuts for applying the one time code confirmation 
    if(data && data.mode === 'verifyEmail' || data && data.mode === 'recoverEmail' ) {
      // Applies the one-time code confirmation
      this.auth.applyActionCode(this.code)
        // Refreshes the current user
        .then( () => this.auth.user.reload() )
        // Dispays the error code, eventually
        .catch( error => this.showError(error.code) );
    }

    // Populates the form according to the requested action
    this.switchPage(data && data.mode || 'signIn');

    // Opens the login dialog
    return super.open(data);
  }

  private switchPage(page: loginAction) {

    // Resets the status
    this.progress = false;
    this.hide = true;
    this.error = null;

    // Removes all the controls from the form group
    Object.keys(this.form.controls).forEach( control => {
      this.form.removeControl(control);
    });
    
    // Add the relevant controls to the form according to selected page
    switch(this.page = page) {

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

      case 'delete':
      this.form.addControl('password', this.password);      
      break;
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
    this.error = error;
    // Makes sure to turn off the error message after 3s
    setTimeout(() => this.error = '', 3000);
  }

  /** Turns the error code into the relevant error message */
  public errorMessage(code: string, msgs: any = {}): void {    
    // Turns the error code into camelCase
    const key = code.camelize().replace('/','.');
    // Look up the available error messages or return the error code itself if not found
    return key.select(msgs, code);
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
      this.resetPassword( this.code, this.newPassword.value );
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

      //default:
    }
  }

  // Navigation helper
  private navigate(to?: string) {
    // Resolves to true when no target is specified
    if(!to) { return Promise.resolve(true); }
    // Navigates as requested
    return this.redirect.navigate(to);
  }

  private signOut() {
    // Navigates home prior to sign-out 
    return this.navigate('home')
      .then( () => this.auth.signOut() );
  }

  private registerNew(email: string, password: string, name: string) {
    // Registering a new user with a email/password
    this.auth.registerNew(email, password, name )
      .then( user => {
        // Creates the new user member  
        this.member.register(user)
          // Sends the email verification
          .then( () => user.sendEmailVerification() )
          // Jumps to the member page
          .then( () => this.navigate('member') )
          // Closes the dialog returning the user
          .then( () => this.close(user) );
      })
      // Dispays the error code, eventually
      .catch( error => this.showError(error.code) );
  }

  private signIn(email: string, password: string) {
    // Sign-in using email/password
    this.auth.signIn(email, password)
      // Closes the dialog returning the user
      .then( user => {
        // Jumps to the requested target...
        this.navigate(this.redirectTo)
          //...prior to close the fialog
          .then( () => this.close(user) );  
      })
      // Dispays the error code, eventually
      .catch( error => this.showError(error.code) );
  }

  public signInWith(provider: string) { 
    // Signing-in with a provider    
    this.auth.signInWith( provider )
      .then( user => { 
        // Creates the new user member if needed, keeps the existing one otherwise 
        this.member.register(user)
          // Jumps to the requested target...
          .then( () => this.navigate(this.redirectTo) )
          // Closes the dialog returning the user
          .then( () => this.close(user) );
      })
      // Dispays the error code, eventually
      .catch( error => this.showError(error.code) );
  }

  private sendEmailVerification(url?: string) {

    return this.auth.user.sendEmailVerification({ url })
      // Closes the dialog returning null
      .then( () => this.close(null) )
      // Dispays the error code, eventually
      .catch( error => this.showError(error.code) );
  }

  private forgotPassword(email: string) {

    this.auth.sendPasswordResetEmail(email)
      // Closes the dialog returning null
      .then( () => this.close(null) )
      // Dispays the error code, eventually
      .catch( error => this.showError(error.code) );
  }

  private resetPassword(code: string, newPassword: string) {
    
    this.auth.confirmPasswordReset(code, newPassword)
      // Jumps to the requested target...
      .then( () => this.navigate(this.redirectTo) )
      // Closes the dialog returning null
      .then( () => this.close(null) )
      // Dispays the error code, eventually
      .catch( error => this.showError(error.code) );
  }
  
  private updateEmail(password: string, newEmail: string) {
    // Refreshes the authentication
    this.auth.refresh(password)
      // Updates the email returning the new user object
      .then( user => user.updateEmail(newEmail).then( () => this.close(user) ) )
      // Dispays the error code, eventually
      .catch( error => this.showError(error.code) );
  }

  private updatePassword(password: string, newPassword: string) {
    // Refreshes the authentication
    this.auth.refresh(password)
      // Updates the password returning the new user object
      .then( user => user.updatePassword(newPassword).then( () => this.close(user) ) )
      // Dispays the error code, eventually
      .catch( error => this.showError(error.code) );
  }

  private deleteAccount(password: string) {

    // Refreshes the authentication
    this.auth.refresh(password)
      .then( user => {
        // Navigates home first
        this.navigate('/')
          // Deletes the user member first 
          .then( () =>this.member.delete() )
          // Deletes the user object next
          .then( () => user.delete() );
      })
      // Closes the dialog returning null
      .then( () => this.close(null) )
      // Dispays the error code, eventually
      .catch( error => this.showError(error.code) );
  }
}  
