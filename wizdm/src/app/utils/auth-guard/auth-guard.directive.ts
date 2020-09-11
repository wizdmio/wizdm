import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { AuthService, User } from '@wizdm/connect/auth';
import type { LoginData } from 'app/dialogs/login';
import { DialogLoader } from 'app/dialogs';
import { finalize } from 'rxjs/operators';

/** AuthGuard on click */
@Directive({
  selector: '[authClick]'
})
export class AuthGuardDirective {

  private skipEmail: boolean = true;

  constructor(private auth: AuthService, private dialogs: DialogLoader) { }

  /** Returns true when authorization has been granted */
  private isClickAuthorized(user: User = this.auth.user): boolean {

    return !!user && (user.emailVerified || this.skipEmail);
  }

  /** Guarded click event */
  @Output() authClick = new EventEmitter<MouseEvent>();

  /** Enables emailVerified guard */
  @Input() set emailVerified(value: boolean) {
    this.skipEmail = !coerceBooleanProperty(value);
  }

  @HostListener('click', ['$event']) onClick(ev: MouseEvent) {

    // Whenever the user is already authorized, emits the guarded click event
    if( this.isClickAuthorized() ) { this.authClick.emit(ev); }

    // Activates the guard otherwise
    else {

      // Prepares the LoginAction according to the auth conditions
      const mode = this.auth.authenticated ? 'sendEmailVerification' : undefined;

      // Activates the 'login' actionlink programatically intercepting the returned value
      this.dialogs.open<LoginData, User>('login', { mode } ).then( user => {

        // Whenever the user is now authorized, emits the guarded click event
        if( this.isClickAuthorized(user) ) { this.authClick.emit(ev); }
      });
    }   
  }
}
