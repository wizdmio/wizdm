import { Injectable } from '@angular/core';
import { Resolve, 
         RouterStateSnapshot, 
         ActivatedRouteSnapshot,
         Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { ContentService } from '../content/content-manager.service';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import * as moment from 'moment';

// Support for detectLanguage
declare interface Window { navigator: any;}
declare const window: Window;

@Injectable()
export class ResolverService implements Resolve<any> {

  constructor(private content: ContentService,
              private auth: AuthService, 
              private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | any {

    let lang = route.params['lang'];

    // Detects the browser language on request and re-route to it
    if(lang === 'auto') {
      
      lang = this.detectLanguage();
      console.log('Using browser language: ' + lang);

      this.router.navigate([lang || 'en']);
      return null;
    }

    // Waits to check for authentication prior to load the content to avoid flickering at startup
    return this.auth.userData$.pipe(
      take(1),
      switchMap( profile => {

        // If authenticated, get the user preferred language
        if(profile != null && profile.lang != null && profile.lang != lang) {
          
          console.log('Switch to user language: ' + profile.lang);

          this.router.navigate([profile.lang]);
          return of(null);
        }

        // Sets the moment locale globally
        moment.locale(lang);

        // Load the localized content
        return this.content.use(lang);
      })
    );
  }

  public detectLanguage() : string {
      
    if(typeof window === 'undefined' || typeof window.navigator === 'undefined') { 
      return undefined;
    }
    // Detects the preferred language according to the browser, whenever possible
    let code: string = (window.navigator.languages ? window.navigator.languages[0] : null) || 
                        window.navigator.language || 
                        window.navigator.browserLanguage || 
                        window.navigator.userLanguage;

    // Returns the relevant part of the language code (ex: 'en-US' -> 'en')
    return code.split('-')[0];
  }
}
