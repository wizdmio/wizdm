import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Oauth2Handler implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {

    // Gets the firebase actionlink request data
    const mode = route.queryParamMap.get('mode');
    const code = route.queryParamMap.get('oobCode');
    const api  = route.queryParamMap.get('apiKey');
    const lang = route.queryParamMap.get('lang') || 'en';
    const url  = route.queryParamMap.get('continueUrl') || 'home';

    //...and translates into the proper request for the login module
    return this.router.createUrlTree([lang, 'login'], { 
      queryParams: { mode, code, url },
      //replaceUrl: true
    });
  }
}
