import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ContentManager } from '../content-manager/content-manager.service';
import { LanguageResolver } from '../language-resolver/language-resolver.service';
import { Observable, of } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContentResolver implements Resolve<any> {

  constructor(private content  : ContentManager,
              private language : LanguageResolver,
              private router   : Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | any {

    let lang = route.params['lang'];

    // Detects the browser language on request and re-route to it
    if(lang === 'auto') {
      
      lang = this.detectLanguage().split('-')[0];
      console.log('Using browser language: ' + lang);

      this.router.navigate([lang || 'en']);
      return null;
    }

    // Resolve the language according to the current implementation of LanguageResolver
    // This is used by @wizdm/connect/UserProfile to resolve to the user language when 
    // authenticated
    const language = this.language.resolveLanguage();
    const resolver = typeof language === 'string' ? of(language) : language;
    return resolver.pipe(
      first(),
      switchMap( language => {

        // Switch to a different language when requested
        if(!!language && language !== lang) {
          
          console.log('Resolving to language: ', language);

          this.router.navigate([language]);
          return of(null);
        }

        // Load the localized content in the requested language
        return this.content.use(lang);
      })
    );
  }

  public detectLanguage() : string {

    const navigator: any = window.navigator || {};

    // Detects the preferred language according to the browser, whenever possible
    return (navigator.languages ? navigator.languages[0] : null) || 
            navigator.language || 
            navigator.browserLanguage || 
            navigator.userLanguage || 'en';
  }
}
