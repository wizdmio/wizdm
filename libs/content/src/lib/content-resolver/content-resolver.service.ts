import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, Router, NavigationEnd } from '@angular/router';
import { ContentManager } from '../content-manager/content-manager.service';
import { Observable, of } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContentResolver implements Resolve<any> {

  constructor(readonly content: ContentManager, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | any {

    let lang = route.params['lang'];

    // Detects the browser language on request and re-route to it
    if(lang === 'auto') {
      
      lang = this.detectLanguage().split('-')[0];
      console.log('Using browser language: ' + lang);

      this.router.navigate([lang || 'en']);
      return null;
    }

    // Resolve the language according to the current implementation of resolveLanguage()
    // Override the default implementation according to your appliaction logic
    const language = this.resolveLanguage();
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

  public detectLanguage(): string {

    const navigator: any = window.navigator || {};

    // Detects the preferred language according to the browser, whenever possible
    return (navigator.languages ? navigator.languages[0] : null) || 
            navigator.language || 
            navigator.browserLanguage || 
            navigator.userLanguage;
  }
  
  // Override this function to resolve for a specific language 
  public resolveLanguage(): string | Observable<string> {
    return <string>null;
  }
  
  /**
   * Helper function to force reloading the content while navigating to the new language
   * @param lang the new language code to switch to
   * @param url the optional relative url to navigate to. The function navigates tothe current position if not specified.
   */
  public switchLanguage(lang: string, url?: string): void {

    // Checks if a language change is requested
    if(lang !== this.lang) {

      // Force reloading component strategy backing-up the current reuse strategy function
      let strategy = this.router.routeReuseStrategy.shouldReuseRoute;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;

      // Subscribe to the navigation end
      this.router.events.pipe( 
        filter( e => e instanceof NavigationEnd),
        first() 
      ).subscribe( () => {
        
        // Restore the original reausing strategy function after navigation completed
        this.router.routeReuseStrategy.shouldReuseRoute = strategy;
      });
    }

    const re = new RegExp(`^\/${this.lang}\/+`);

    // Computes the target path....
    let target = url ? 
    
      // ...to the requested url when specified
      `/${lang}/${url}` : 

      // ...or to the exact same page as the current one
      this.router.url.replace(re, `/${lang}/`);

    // Navigate to the target page (switching language if necessary)
    this.router.navigateByUrl(target);
  }
}
