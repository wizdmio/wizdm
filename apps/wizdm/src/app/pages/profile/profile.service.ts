import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserProfile } from 'app/utils/user-profile';
import { take, map } from 'rxjs/operators';

@Injectable()
export class ProfileService implements CanActivate {

  constructor(private profile: UserProfile, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    console.log(state.url);

    return this.profile.data$.pipe( take(1), map(
      data => {

        if(!data) { return true; }

        const redirect = state.url.replace(/@me(\/|$)/, (_, trail) => {
          return '@' + data.userName + trail;
        });

        console.log(redirect);

        return redirect !== state.url ? 
          this.router.parseUrl(redirect) :
            true;
      }
    ));
  }
}