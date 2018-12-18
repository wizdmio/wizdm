import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, Router, NavigationEnd } from '@angular/router';
import { ContentManager } from '@wizdm/content';
import { UserProfile } from '@wizdm/connect';
import { Observable, of } from 'rxjs';
import { switchMap, filter, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContentResolver implements Resolve<any> {

  constructor(readonly content : ContentManager,
              readonly user    : UserProfile,
              private  router  : Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | any {

    let lang = route.params['lang'];

    // Detects the browser language on request and re-route to it
    if(lang === 'auto') {
      
      lang = this.detectLanguage().split('-')[0];
      console.log('Using browser language: ' + lang);

      this.router.navigate([lang || 'en']);
      return null;
    }

    // Implements a basic language resolver returning the user preferred language
    // captured from the user profile stored in the database. Since this observable
    // pipes from the AuthService this resolver grants the page won't show up before
    // the user authentication has been checked preventing page flickering 
    return this.user.asObservable().pipe( 
      first(), 
      switchMap( profile => {

        const language = !!profile ? profile.lang : lang;

          // Switch to a different language when requested
        if(language !== lang) {
          
          console.log('Resolving to language: ', language);

          this.router.navigate([language]);
          return of(null);
        }

        // Load the localized content in the requested language
        return this.content.use(lang);
      }));
  }

  public detectLanguage(): string {

    const navigator: any = window.navigator || {};

    // Detects the preferred language according to the browser, whenever possible
    return (navigator.languages ? navigator.languages[0] : null) || 
            navigator.language || 
            navigator.browserLanguage || 
            navigator.userLanguage;
  }
  
  /**
   * Helper function to force reloading the content while navigating to the new language
   * @param lang the new language code to switch to
   * @param url the optional relative url to navigate to. The function navigates tothe current position if not specified.
   */
  public switchLanguage(lang: string, url?: string): void {

    // Checks if a language change is requested
    if(lang !== this.content.language) {

      // Force reloading component strategy backing-up the current reuse strategy function
      const strategy = this.router.routeReuseStrategy.shouldReuseRoute;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;

      // Subscribe to the next NavigationEnd event
      this.router.events.pipe( filter( e => e instanceof NavigationEnd), first() )
        .subscribe( () => {  
          // Restores the original reusing strategy function after navigation completed
          this.router.routeReuseStrategy.shouldReuseRoute = strategy;
        });
    }

    const re = new RegExp(`^\/${this.content.language}`);

    // Computes the target path....
    const target = url ? 
      // ...to the requested url when specified
      `/${lang}/${url}` : 
      // ...or to the exact same page as the current one
      this.router.url.replace(re, `/${lang}`);

    // Navigate to the target page (switching language if necessary)
    this.router.navigateByUrl(target);
  }
}
