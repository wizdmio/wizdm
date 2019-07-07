import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UserProfile } from '@wizdm/connect';
import { NavigatorService } from '../../navigator';
import { ContentResolver } from '../../core';
import { $animations } from './login-animations';
import { Observable, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';

type pageTypes = 'register' | 
                 'signIn' | 
                 'forgotPassword' | 
                 'resetPassword' | 
                 'changePassword' | 
                 'emailVerify' | 
                 'verifyEmail' | 
                 'recoverEmail' | 
                 'changeEmail' | 
                 'delete';

@Component({
  selector : 'wm-login',
  templateUrl : './login.component.html',
  styleUrls : ['./login.component.scss'],
  animations: $animations
})
export class LoginComponent implements OnInit  {

  readonly msgs$: Observable<any>;

  public page: pageTypes;
  public progress = false;
  public hide = true;

  private code: string;

  public form: FormGroup;
  public name: FormControl;
  public email: FormControl;
  public password: FormControl;
  public newEmail: FormControl;
  public newPassword: FormControl;

  constructor(private content   : ContentResolver,
              private profile   : UserProfile, 
              private navigator : NavigatorService,
              private route     : ActivatedRoute) {

    // Gets the localized content pre-fetched during routing resolving
    this.msgs$ = content.stream('login');

    // Creates the loging form controls
    this.name = new FormControl(null, Validators.required);
    this.email = new FormControl(null, [Validators.required, Validators.email]);
    this.password = new FormControl(null, Validators.required);
    this.newEmail = new FormControl(null, [Validators.required, Validators.email]);
    this.newPassword = new FormControl(null, Validators.required);
    
    // Group the controls
    this.form = new FormGroup({});
  }

  // Returns the Auth service instance
  private get auth() { return this.profile.auth; }

  ngOnInit() {

    // Discrimnate among the login option using the queryParameters
    this.route.queryParamMap.subscribe( (params: ParamMap) => {

      const mode = params.get('mode') || 'signIn';
      this.code = params.get('code');

      console.log('login mode: ', mode);

      switch(mode) {

        case 'signOut':
        this.signOut();
        return;

        case 'emailVerify': // Sends and email to verify the user identity
        
        this.auth.sendEmailVerification()
          .catch( error => this.showError(error.code) );
        
        break;

        // Apply the action code in case of email revert or verification
        case 'verifyEmail':
        case 'recoverEmail':

        if(this.code) {
          this.auth.applyActionCode( this.code )
            .catch( error => this.showError(error.code) );
        }
        break;

        case 'resetPassword':
        // Just goes trough switching to the resetPassword page with the received action code
        break;
      }

      // Switches to the relevant page
      this.switchPage(mode as pageTypes);
    });
  }

  // Loggin-in helper to navigate to the project page after successfully signing-in by 
  // applying the user preferred language
  private loggedIn() {

    this.profile.asObservable().pipe(
      take(1),
      tap( user => {

        this.progress = false;    
    
        // Jumps to the projects explore on successful login
        if(!!user) {
          console.log('logged in successfully as: ' + user.email);
    
          // Checks for user preferrend language
          const userLang = user.lang || 'en';
  
          // Jump to the projects explore switching to the user language if needed
          this.content.switchLanguage(userLang, 'explore');
        }
      })
    ).subscribe();
  }

  // This function switches among the form controls configurations dynamically 
  // to support 'morphing' across the different pages
  private switchPage(page: pageTypes) {

    // Skips when not needed
    if(page === this.page) { return; }

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

      default:
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

      case 'emailVerify':
      case 'verifyEmail':
      case 'recoverEmail':
      // Formless page
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
   * Shows the error message relying on the global error handler
   * @param error code of the error
   */
  private showError(error: string): void {
    this.navigator.notifyMessage(error);
    this.progress = false;
  }

  // Execute the form requested action
  public loginAction() {

    // Perform the requested action
    switch(this.page) {

      case 'register':
      this.registerNew( this.email.value, 
                        this.password.value, 
                        this.name.value );
      break;

      default:
      case 'signIn':
      this.signIn( this.email.value, 
                   this.password.value );
      break;

      case 'forgotPassword':
      this.forgotPassword( this.email.value );
      break;

      case 'resetPassword':
      this.resetPassword( this.code, 
                          this.newPassword.value );
      break;

      case 'changePassword':
      this.updatePassword( this.password.value,
                           this.newPassword.value );
      break;

      case 'changeEmail':
      this.updateEmail( this.password.value,
                        this.newEmail.value );
      break;

      case 'delete':
      this.deleteAccount( this.password.value );
      break;
    }
  }

  public signInWith(provider: string) { 

    this.progress = true;;

    // Signing-in with a provider using the current language before jumping to the projects page by applying the user preferrend language (if any)
    this.auth.signInWith( provider )
      .then( () => this.loggedIn() )
      .catch( error => this.showError(error.code) );
  }

  private signIn(email: string, password: string) {
    
    this.progress = true;

    // SignIn using email/password before jumping to the projects page by applying the user preferrend language
    this.auth.signIn(email, password)
      .then( () => this.loggedIn() )
      .catch( error => this.showError(error.code) );
  }

  private registerNew(email: string, password: string, name: string) {

    this.progress = true;

    // Signing-in with a email/password using the current language than send a verification email befor jumping to the profile page
    this.auth.registerNew(email, password, name )
      .then( () => this.auth.sendEmailVerification() )
      .then( () => this.content.navigate('profile') )
      .catch( error => this.showError(error.code) );
  }

  private forgotPassword(email: string) {
    
    this.progress = true;

    // Send an action code link to the registerred email to reset a forgotten password
    this.auth.forgotPassword(email, this.content.language )
      .catch( error => this.showError(error.code) );
  }

  private resetPassword(code: string, newPassword: string) {

    this.progress = true;

    // Resets the forgotten password by applying the action code received than jumps to the profile page
    this.auth.resetPassword(code, newPassword)
      .then( () => this.content.navigate('profile') )
      .catch( error => this.showError(error.code) );
  }

  private updateEmail(password: string, newEmail: string) {

    this.progress = true;

    // Update the account email by re-authenticating than send a verification request and jumps to the profile page
    this.auth.updateEmail(password, newEmail)
      .then( () => this.auth.sendEmailVerification() )
      .then( () => this.content.navigate('profile') )
      .catch( error => this.showError(error.code) );
  }

  private updatePassword(password: string, newPassword: string) {

    this.progress = true;

    // Updte the account password by re-authenticating than jumps to the profile page
    this.auth.updatePassword(password, newPassword)
      .then( () => this.content.navigate('profile') )
      .catch( error => this.showError(error.code) );
  }

  private deleteAccount(password: string) {

    this.progress = true;
  
    this.auth.deleteUser(password)
      .then( () => this.content.navigate('home') )
      .catch( error => this.showError(error.code) );
  }

  private signOut(){
    
    // Sign-out...
    this.auth.signOut();
    //...and navigate to home overwriting the logout route to prevent unwanted
    // behaviours in case of navigating back after logout
    this.content.navigate('home', { replaceUrl: true });
  }
}  