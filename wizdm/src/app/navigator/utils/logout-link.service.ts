import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { AuthService } from '@wizdm/connect/auth';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogoutLinkObserver implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    // Do nothing if already out
    if(!this.auth.authenticated) { return false; }

    // Gets the current language whenever already defined
    const lang = this.router.url.split('/')[1] || 'auto';

    // Signs-out and redirects to home while keeping the current language
    return this.auth.signOut().then( () => this.router.createUrlTree(['/', lang]) );
  }
}
