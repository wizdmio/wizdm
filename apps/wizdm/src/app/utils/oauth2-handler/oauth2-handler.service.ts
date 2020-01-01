import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
//import { AuthService } from '@wizdm/connect/auth';

@Injectable({
  providedIn: 'root'
})
export class Oauth2Handler implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {

    const mode = route.queryParamMap.get('mode');
    const code = route.queryParamMap.get('oobCode');
    const api  = route.queryParamMap.get('apiKey');
    const lang = route.queryParamMap.get('lang') || 'en';
    const url  = route.queryParamMap.get('continueUrl') || 'home';

    //...and navigate to the login page with the requested language
    return this.router.createUrlTree([lang, 'login'], { 
      queryParams: { mode, code, url },
      //replaceUrl: true
    });
  }
}