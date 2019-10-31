import { Injectable } from '@angular/core';
import { Router, 
         UrlTree,
         CanActivate,
         ActivatedRouteSnapshot, 
         RouterStateSnapshot } from '@angular/router';
import { UserProfile } from '@wizdm/connect';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(readonly router: Router, readonly user: UserProfile) { }

  // Implements single route user authentication guarding
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean|UrlTree> {

    return this.user.asObservable().pipe(
      first(),
      map( user => {
        // Reverts navigation to the login page on invalid user profile
        if(!user) {

          const lang = this.router.url.split('/')[1];

          console.log('canActivate: Authentication required');
          // Gets the current language when possible
          //const lang = this.content.language || 'en';
          // Returns an UrlTree pointing to the login page
          return this.router.createUrlTree([lang, 'login']); 
        }
        // Allows navigation otherwise
        console.log('canActivate: Access granted');
        return true;
      })
    );
  }
}