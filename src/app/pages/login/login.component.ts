import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ContentManager } from 'app/content';
import { LoginService } from './login.service';
import { $loginAnimations } from './login-animations';

@Component({
  selector : 'wm-login',
  templateUrl : './login.component.html',
  styleUrls : ['./login.component.scss'],
  animations: $loginAnimations
})
export class LoginComponent implements OnInit {

  private page: 'signIn' | 'register' | 'reset';
  private msgs = null;
  private hide = true;
  
  private form: FormGroup;
  private name: FormControl;
  private email: FormControl;
  private password: FormControl;
  
  constructor(private content: ContentManager, 
              private lg: LoginService) {

    this.name = new FormControl(null, Validators.required);
    this.email = new FormControl(null, [Validators.required, Validators.email]);
    this.password = new FormControl(null, Validators.required);
    
    this.form = new FormGroup({
      name: this.name,
      email: this.email,
      password: this.password
    });

    this.switchPage(this.page = 'signIn');
  }

  ngOnInit() {
    this.msgs = this.content.select("login");
  }

  switchPage(page: 'signIn' | 'register' | 'reset') {
    
    switch(this.page = page) {

      default:
      case 'signIn':

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
      case 'signIn':
      this.lg.signIn( this.email.value, this.password.value );
      break;

      case 'register':
      this.lg.registerNew( this.email.value, this.password.value, this.name.value );
      break;

      case 'reset':
      this.lg.resetPassword( this.email.value );
      break;
    }
  }

  signInWith(provider: string) { 
    this.lg.signInWith( provider );
  }
}  