import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { AuthService } from '@wizdm/connect/auth';
import { take, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class WelcomeBack implements CanActivate {

  constructor(private router: Router, private auth: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    // Check user authentication
    return this.auth.state$.pipe( take(1), map( user => {

      // Gets the current language whenever already defined
      const lang = this.router.url.split('/')[1] || 'auto';

      // Jumps to 'welcome-back' whenever loggen-in since we are evidentlly coming back
      return user ? this.router.createUrlTree([ '/', lang, 'welcome-back' ]) : true;

    }));
  }
}