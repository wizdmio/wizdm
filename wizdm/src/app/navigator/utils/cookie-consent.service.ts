import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, NavigationEnd } from '@angular/router';
import { take, switchMap, filter } from 'rxjs/operators';
import { LazyDialogLoader } from '@wizdm/lazy-dialog';
import { AuthService } from '@wizdm/connect/auth';
import { CookieService } from 'app/utils/cookies';
import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';

/** Solicits a cookie consent dialog whenever needed */
@Injectable()
export class CookieConsent implements CanActivate {

  constructor(private router: Router, private auth: AuthService, private cookies: CookieService, private dialog: LazyDialogLoader) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    // Starts by checking about the authentiation status
    this.auth.state$.pipe(take(1), switchMap(user => {
      
      // Terminates if the user is authenticated or the consent has already been expressed
      if(!!user || this.cookies.get('consent') === 'allowed') { 
        
        console.log('Cookie consent already expressed:', !!user ? 'User logged-in' : 'Cookied allowed');
        return EMPTY; 
      } 
      
      // Waits the current navigation to complete
      return this.router.events.pipe(
        
        // Filters for navigation end event
        filter(e => e instanceof NavigationEnd), 
        
        // Completes the observable
        take(1),

        // Opens the consent dialog
        switchMap(() => this.dialog.open<void, boolean>('consent')),

        // Filters for user to allow
        filter(allow => allow)        
      );

      // Saves the allowed cookies consent for future reference 
    })).subscribe(() => this.cookies.put('consent', 'allowed', 100));

    // Alaways returns true allowing the router to complete the navigation towards home
    return true;
  }
}