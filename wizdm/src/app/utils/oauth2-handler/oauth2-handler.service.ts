import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Oauth2Handler implements CanActivate {

  constructor(@Inject(DOCUMENT) private document: Document, private router: Router) {}

  // Returns the window object
  get window(): Window { return this.document.defaultView || window; }

  canActivate(route: ActivatedRouteSnapshot) {

    // Gets the firebase actionlink request data
    const mode = route.queryParamMap.get('mode');
    const code = route.queryParamMap.get('oobCode');
    const api  = route.queryParamMap.get('apiKey');
    const lang = route.queryParamMap.get('lang') || 'en';
    const uri  = route.queryParamMap.get('continueUrl');

    // extracts the relative url from the uri
    const url = uri && uri.replace(new RegExp(`^${this.window.location.origin}`), '');

    //...and translates into the proper request for the login module
    return this.router.createUrlTree([lang, 'login'], { 
      queryParams: { mode, code, url },
      //replaceUrl: true
    });
  }
}
