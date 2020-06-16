import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserProfile } from 'app/navigator/providers/user-profile';
import { Injectable } from '@angular/core';
import { take, map } from 'rxjs/operators';

@Injectable({ 
  providedIn: 'root'
})
export class ValidProfile implements CanActivate {

  constructor(private profile: UserProfile, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.profile.data$.pipe( take(1), map( data => {

      if(data && (!data.userName || !data.searchIndex) ) { 

        // Keeps the same language as the current url
        const lang = state.url.split('/')[1];

        // Jumps to settings
        return this.router.createUrlTree([ lang, 'settings' ]); 
      }

      return true;
    }));
  }
}