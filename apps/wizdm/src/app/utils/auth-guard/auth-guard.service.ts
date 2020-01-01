import { Injectable } from '@angular/core';
import { Router, UrlTree,CanActivate,ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Member } from 'app/core/member';
import { AuthService } from '@wizdm/connect/auth';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(readonly router: Router, readonly auth: AuthService) { }

  // Implements single route user authentication guarding
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean|UrlTree> {

    return this.auth.user$.pipe(
      map( user => {

        // Reverts navigation to the login page on invalid user profile
        if(!user) { // || !user.emailVerified) {

          console.log('canActivate: Authentication required');

          // Stores the requested url
          const url = state.url;

          // Enables email verification whenever needed
          const mode = /*!user.emailVerified ? 'sendEmailVerification' :*/ undefined;

          // Keeps the same language as the current url
          const lang = this.router.url.split('/')[1];
          
          // Redirects to the login page passing along the target url for redirection
          return this.router.createUrlTree([lang, 'login'], { 
            queryParams: { mode, url }
          }); 
        }

        // Allows navigation otherwise
        console.log('canActivate: Access granted');
        return true;
      }),
      // Completes the observable
      first()
    );
  }
}