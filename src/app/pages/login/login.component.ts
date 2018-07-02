import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ContentManager, AuthService } from 'app/core';
import { $loginAnimations } from './login-animations';
import { Subscription } from 'rxjs';

@Component({
  selector : 'wm-login',
  templateUrl : './login.component.html',
  styleUrls : ['./login.component.scss'],
  animations: $loginAnimations
})
export class LoginComponent implements OnInit, OnDestroy  {

  private page: 'sign-in' | 'register' | 'reset' | 'renew';// | 'confirm';
  private error: string = null;
  private progress = false;
  private msgs = null;
  private hide = true;

  private form: FormGroup;
  private name: FormControl;
  private email: FormControl;
  private password: FormControl;
  private subNav: Subscription;
  private subAuth: Subscription;
  
  constructor(private content: ContentManager,
              private router : Router, 
              private route : ActivatedRoute,
              private auth: AuthService) {

    // Creates the loging form controls
    this.name = new FormControl(null, Validators.required);
    this.email = new FormControl(null, [Validators.required, Validators.email]);
    this.password = new FormControl(null, Validators.required);
    
    // Group the controls
    this.form = new FormGroup({
      name: this.name,
      email: this.email,
      password: this.password
    });

    // Makes sure to start from the sign-in page
    this.switchPage(this.page = 'sign-in');
  }

  ngOnInit() {

    // Gets the localized contents
    this.msgs = this.content.select("login");

    // Discrimnate among the login option using the queryParameters
    this.subNav = this.route.queryParamMap.subscribe( (params: ParamMap) => {

      let mode = params.get('mode') || 'login';

      console.log('login mode: ' + mode);

      // If we are coming here 'cause of signout then:
      if(mode === 'logout') {
        this.signOut();
      }

      // This option turns the page into the [asswor renew
      if(mode === 'reset') {
        this.switchPage('renew');
      }
    });

    // Monitors the user signing-in and jumps to the dashboard on success
    // This also works to prevent opening the login page when already logged-in
    this.subAuth = this.auth.authState.subscribe( user => {

      // Jumps to the dashboard on successful login
      if(user) {
        console.log('logged in successfully as: ' + user.email);

        // Gets the redirecting url or fallback to the dashboard
        //let url = this.auth.redirectUrl || 'dashboard';
        let url = 'dashboard';
        
        // Resets the redirect url saved by the guard
        this.auth.redirectUrl = null;

        // Navigate to the requested page only if coming from a login procedure
        if(this.progress) {
          this.progress = false;

          this.router.navigate(['..', url], { relativeTo: this.route });
        }
      }
    });
   }

  ngOnDestroy() {
    this.subNav.unsubscribe();
    this.subAuth.unsubscribe();
  }

  private pageTitle(page: string): string {

    let key = page.camelize();
    return this.msgs.pages[key].title;
  }

  private pageButton(page: string): string {
    
    let key = page.camelize();
    return this.msgs.pages[key].caption; 
  }

  private errorMessage(error: string): string {

    // Turns the message code into camelCase
    let key = error.camelize().replace('/','.');

    // Look up the available error messages or return the error code if not found
    return this.content.select("login.errors." + key, error);
  }

  // This function switches among the form controls configurations dynamically 
  // to support 'morphing' across the different pages
  private switchPage(page: 'sign-in' | 'register' | 'reset' | 'renew') {

    this.progress = false;
    
    switch(this.page = page) {

      default:
      case 'sign-in':

      if(this.form.controls.name) { 
        this.form.removeControl('name');
      }

      if(!this.form.controls.email) {
        this.form.addControl('email', this.email);
      }

      if(!this.form.controls.password) { 
        this.form.addControl('password', this.password);
      }

      break;

      case 'register':
      
      if(!this.form.controls.name) { 
        this.form.addControl('name', this.name);
      }

      if(!this.form.controls.email) {
        this.form.addControl('email', this.email);
      }

      if(!this.form.controls.password) { 
        this.form.addControl('password', this.password);
      }
      break;

      case 'reset':

      if(this.form.controls.name) { 
        this.form.removeControl('name');
      }

      if(!this.form.controls.email) {
        this.form.addControl('email', this.email);
      }

      if(this.form.controls.password) { 
        this.form.removeControl('password');
      }
      break;

      case 'renew':

      if(this.form.controls.name) { 
        this.form.removeControl('name');
      }

      if(this.form.controls.email) {
        this.form.removeControl('email');
      }

      if(!this.form.controls.password) { 
        this.form.addControl('password', this.password);
      }
      break;
    }
  }

  private signInOrRegister() {
    
    switch(this.page) {

      default:
      case 'sign-in':
      this.signIn( this.email.value, 
                   this.password.value );
      break;

      case 'register':
      this.registerNew( this.email.value, 
                        this.password.value, 
                        this.name.value );
      break;

      case 'reset':
      //this.resetPassword( this.email.value );
      this.switchPage('renew');
      break;

      case 'renew':
      //this.confirmPassword( this.email.value );
      break;
    }
  }

  private signInWith(provider: string) { 

    this.progress = true;

    // Signing-in with a provider using the current language    
    this.auth.signInWith( provider, this.content.language.lang )
      .catch( error => {
        // Keep the rror code on failure
        this.error = error.code;
        this.progress = false;
      })
  }

  private signIn(email: string, password: string) {
    
    this.progress = true;

    // Sign-in using email/password
    this.auth.signIn(email, password)
      .catch( error => {
      // Keep the rror code on failure
      this.error = error.code;
      this.progress = false;
    });
  }

  private registerNew(email: string, password: string,name: string) {

    this.progress = true;

    // Signing-in with a email/password using the current language
    this.auth.registerNew(email, password, name, this.content.language.lang )
      .catch( error => {
        // Keep the rror code on failure
        this.error = error.code;
        this.progress = false;
      });
  }

  private resetPassword(email: string) {
    
    this.progress = true;

    this.auth.resetPassword(email)
      .catch( error => {
        // Keep the rror code on failure
        this.error = error.code;
        this.progress = false;
      })
  }

  private signOut(){
    
    // Sign-out...
    this.auth.signOut();

    //...and navigate to home
    this.router.navigate(['..','home'], { relativeTo: this.route });
  }
}  