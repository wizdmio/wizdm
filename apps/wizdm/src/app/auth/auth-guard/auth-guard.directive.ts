import { Directive, HostListener, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ActionLinkObserver } from '@wizdm/actionlink';
import { AuthService, User } from '@wizdm/connect/auth';
import { Subscription } from 'rxjs';

/** AuthGuard on click */
@Directive({
  selector: '[authClick]'
})
export class AuthGuardDirective implements OnDestroy {

  private skipEmail: boolean = true;
  private sub: Subscription;

  constructor(private auth: AuthService, private observer: ActionLinkObserver) { }

  /** Returns true when authorization has been granted */
  private isClickAuthorized(user: User = this.auth.user): boolean {

    return !!user && (user.emailVerified || this.skipEmail);
  }

  /** Guarded click event */
  @Output() authClick = new EventEmitter<MouseEvent>();

  /** Enables emailVerified guard */
  @Input('emailVerified') set emailVerified(value: boolean) {
    this.skipEmail = !coerceBooleanProperty(value);
  }

  @HostListener('click', ['$event']) onClick(ev: MouseEvent) {

    // Whenever the user is already authorized, emits the guarded click event
    if( this.isClickAuthorized() ) { this.authClick.emit(ev); }

    // Activates the guard otherwise
    else {

      // Prepares teh LoginAction according to the auth conditions
      const mode = this.auth.authenticated ? 'sendEmailVerification' : undefined;

      // Activates the 'login' actionlink programatically intercepting the returned value
      this.sub = this.observer.activate<User>('login', { mode } ).subscribe( user => {

        // Whenever the user is now authorized, emits the guarded click event
        if( this.isClickAuthorized(user) ) { this.authClick.emit(ev); }
      });
    }
  }

  ngOnDestroy() {
    // Disposes of the subscription
    this.sub && this.sub.unsubscribe();
  }
}
