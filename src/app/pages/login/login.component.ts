import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
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

  private page: 'sign-in' | 'register' | 'reset';
  private msgs = null;
  private hide = true;
  
  private form: FormGroup;
  private name: FormControl;
  private email: FormControl;
  private password: FormControl;
  private error: string;
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
  
    // Subscribe to the active route to check if we are signin-in or out
    this.subNav = this.route.url.subscribe( (segments: UrlSegment[]) => {

      console.log('login action: ' + segments[0]);

      // If we are coming here 'cause of signout then:
      if(segments[0].toString() === 'logout') {

        // Sign-out...
        this.auth.signOut();

        //...and navigate to home
        this.router.navigate(['..','home'], { relativeTo: this.route });
      }
    });

    // Monitors the user signing-in and jumps to the dashboard on success
    // This also works to prevent opening the login page when already logged-in
    this.subAuth = this.auth.user.subscribe( user => {

      // Jumps to the dashboard on successful login
      if(user) {
        console.log('logged in successfully as: ' + user.email);
        this.router.navigate(['..','dashboard'], { relativeTo: this.route });
      }
    });
   }

  ngOnDestroy() {
    this.subNav.unsubscribe();
    this.subAuth.unsubscribe();
  }

  pageTitle(page: string): string {

    let key = page.camelize();
    return this.msgs.pages[key].title;
  }

  pageButton(page: string): string {
    
    let key = page.camelize();
    return this.msgs.pages[key].caption; 
  }

  errorMessage(error: string): string {

    // Turns the message code into camelCase
    let key = error.camelize().replace('/','.');

    // Look up the available error messages
    let msg = this.content.select("login.errors." + key);

    // returns the message, if any, the key otherwise
    return msg || key;
  }

  // This function switches among the form controls configurations dynamically 
  // to support 'morphing' across the different pages
  switchPage(page: 'sign-in' | 'register' | 'reset') {
    
    switch(this.page = page) {

      default:
      case 'sign-in':

      if(this.form.controls.name) { 
        this.form.removeControl('name');
      }

      if(!this.form.controls.password) { 
        this.form.addControl('password', this.password);
      }

      break;

      case 'register':
      
      if(!this.form.controls.name) { 
        this.form.addControl('name', this.name);
      }

      if(!this.form.controls.password) { 
        this.form.addControl('password', this.password);
      }
      break;

      case 'reset':
      
      if(this.form.controls.name) { 
        this.form.removeControl('name');
      }

      if(this.form.controls.password) { 
        this.form.removeControl('password');
      }
      break;
    }
  }

  signInOrRegister() {
    
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
      this.resetPassword( this.email.value );
      break;
    }
  }

  signInWith(provider: string) { 

    // Signing-in with a provider using the current language    
    this.auth.signInWith( provider, this.content.language.lang )
      .catch( error => {
        // Keep the rror code on failure
        this.error = error.code;
      })
  }

  signIn(email: string, password: string) {
    
    // Sign-in using email/password
    this.auth.signIn(email, password)
      .catch( error => {
      // Keep the rror code on failure
      this.error = error.code;
    });
  }

  registerNew(email: string, password: string,name: string) {

    this.auth.registerNew(email, password, name)
      .catch( error => {
        // Keep the rror code on failure
        this.error = error.code;
      });
  }

  resetPassword(email: string) {
    this.auth.resetPassword(email);
  }
}  