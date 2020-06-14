// Welcome
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { AuthService } from '@wizdm/connect/auth';
import { take, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class WelcomeBack implements CanActivate {

  // True when firstly created
  private newComer: boolean = true;

  constructor(private router: Router, private auth: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    // Do nothing if this is not the very first hit
    if(!this.newComer || state.url.split('/')[1] !== 'auto') { return true; }

    // Check user authentication
    return this.auth.state$.pipe( take(1), map( user => {

      // Makes sure skipping this phase next time
      this.newComer = false;

      // Jumps to 'welcome-back' whenever loggen-in since we are evidentlly coming back
      return user ? this.router.createUrlTree([ 'auto', 'welcome-back' ]) : true;

    }));
  }
}