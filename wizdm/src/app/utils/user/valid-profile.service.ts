import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserProfile } from './user-profile.service';
import { Injectable } from '@angular/core';
import { take, map } from 'rxjs/operators';

/** Checks the user's profile for basic validity prior to grant access  */
@Injectable({ 
  providedIn: 'root'
})
export class ValidProfile implements CanActivate {

  constructor(private profile: UserProfile, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.profile.data$.pipe( take(1), map( data => {

      if(data && (!data.userName || !data.fullName || !data.searchIndex) ) { 

        // Keeps the same language as the current url
        const lang = state.url.split('/')[1];

        // Jumps to settings
        return this.router.createUrlTree([ lang, 'settings' ]); 
      }

      return true;
    }));
  }
}