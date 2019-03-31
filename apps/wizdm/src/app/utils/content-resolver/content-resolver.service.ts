import { Injectable } from '@angular/core';
import { Router, 
         UrlTree,
         Resolve, 
         CanActivate,
         CanDeactivate,
         ActivatedRouteSnapshot, 
         RouterStateSnapshot,
         NavigationEnd,
         NavigationExtras } from '@angular/router';
import { ContentManager } from '@wizdm/content';
import { UserProfile } from '@wizdm/connect';
import { Observable, of } from 'rxjs';
import { switchMap, filter, first, map, tap } from 'rxjs/operators';
import * as moment from 'moment';

export interface CanPageDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
 }

@Injectable({
  providedIn: 'root'
})
export class ContentResolver implements Resolve<any>, CanActivate, CanDeactivate<CanPageDeactivate> {

  constructor(readonly content : ContentManager,
              readonly user    : UserProfile,
              readonly router  : Router) { }

  // Implements routint pre-fetch data resolving
  resolve(route: ActivatedRouteSnapshot): Observable<any> | any {

    // When lang params is specified we are loading the navigator or switching language. Defaulting to the current language if already loaded
    let lang = route.params['lang'] || this.content.language;
    // Detects the browser language on request and re-route to it
    if(lang === 'auto') {
      
      lang = this.detectLanguage().split('-')[0];
      console.log('Using browser language: ' + lang);
      // Switch to the detected language
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
          // Switch to the user profile language when needed
        if(language !== lang) {
          
          console.log('Resolving to profile language: ', language);

          this.router.navigate([language]);
          return of(null);
        }
        // Sets the moment locale globally
        moment.locale(lang);
        
        // Load the localized content in the requested language
        return this.content.use( lang, route.data.modules );
      }));
  }

  // Implements single route user authentication guarding
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean|UrlTree> {

    return this.user.asObservable().pipe(
      first(),
      map( user => {
        // Reverts navigation to the login page on invalid user profile
        if(!user) {

          console.log('canActivate: Authentication required');
          // Gets the current language when possible
          const lang = this.content.language || 'en';
          // Returns an UrlTree pointing to the login page
          return this.router.createUrlTree([lang, 'login']); 
        }
        // Allows navigation otherwise
        console.log('canActivate: Access granted');
        return true;
      })
    );
  }

  // Implements single route deactivation
  canDeactivate(page: CanPageDeactivate) {
    // Allows deactivation for pages not implementing the canDeactivate interface
    if(!page || !page.canDeactivate) {
      console.log('canDeactivate: Allowed');
      return true;
    }
    // Simply reverts to the current page implementation of canDeactivate interface
    console.log('canDeactivate: Reverts to page...');
    return page.canDeactivate();
  }

  // Routing helper to easily jump on a specified page keeping the current language
  public goTo(to: string, extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate([ this.content.language || 'en', to ], extras );
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
  public switchLanguage(lang: string, url?: string): Promise<boolean> {

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
    return this.router.navigateByUrl(target);
  }
}
