import { Injectable } from '@angular/core';
import { Resolve, 
         RouterStateSnapshot, 
         ActivatedRouteSnapshot } from '@angular/router';

import { ContentManager } from './content-manager.service';
import { AuthService } from '../auth/auth.service';
import { Observable, of, timer } from 'rxjs';
import { switchMap, mergeMap, map } from 'rxjs/operators';


// Support for detectLanguage
declare interface Window { navigator: any;}
declare const window: Window;

@Injectable()
export class ContentResolver implements Resolve<any> {

  constructor(private content: ContentManager,
              private auth: AuthService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

    let lang = route.params['lang'];

    // Detects the browser language on request
    if(lang === 'auto') {
      lang = this.detectLanguage();
    }
/*
    return this.auth.authState.pipe(
      mergeMap( user => {

        return this.content.use(lang);
      })
    );
*/
    return this.content.use(lang);
  }

  public detectLanguage() : string {
      
    if(typeof window === 'undefined' || typeof window.navigator === 'undefined') { 
      return undefined;
    }

    let bcl: any = window.navigator.languages ? window.navigator.languages[0] : null;
  
    return bcl || window.navigator.language 
               || window.navigator.browserLanguage 
               || window.navigator.userLanguage;
  }
}
