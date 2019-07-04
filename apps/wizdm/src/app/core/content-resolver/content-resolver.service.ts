import { Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Router, 
         UrlTree,
         Resolve, 
         CanActivate,
         CanDeactivate,
         ActivatedRouteSnapshot, 
         RouterStateSnapshot,
         NavigationExtras } from '@angular/router';
import { UserProfile } from '@wizdm/connect';
import { Observable, of, forkJoin, BehaviorSubject } from 'rxjs';
import { switchMap, filter, first, map, tap, zip, catchError } from 'rxjs/operators';
import moment from 'moment';

export interface CanPageDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
 }

@Injectable({
  providedIn: 'root'
})
export class ContentResolver implements Resolve<any>, CanActivate, CanDeactivate<CanPageDeactivate> {

  // Data snapshot keeps track of the currenlty selected language as well
  private data: any = { lang: 'en' };

  // Data observer
  private _data$ = new BehaviorSubject<any>(this.data);

  /** Returns the current language as a two digit code */
  get language(): string { return this.data.lang || 'en'; }

  /** Returns an observable streaming the current language code  */
  get language$(): Observable<string> { return this._data$.pipe( map(data => data.lang || 'en') ); }

  constructor(readonly user    : UserProfile,
              readonly router  : Router,
              private  http    : HttpClient,  
              private  adapter : DateAdapter<any>) { }

  /** Selects the requested portion of data from the content
   * @param select (optional) a string delimiter to select the requested portion of the content; returns the full content when undefined
   * @param default (optional) an optional object to be returned in the eventuality the required content is not present
   */
  public stream(select?: string, defaults?: any): Observable<any> {

    return this._data$.pipe( 
      // Selects the data portion of interst
      map( data => !!select ? select.select(data, defaults) : (data || defaults) ),
      // Filters empty data stream. This may happen while switching languages since
      // the router is resolving the route sequencially
      filter( data => !!data ) 
    );
  }

  public snapshot(select: string, defaults?: any): any {
    return select.select(this.data, defaults);
  }

  // Implements routing pre-fetch data resolving
  resolve(route: ActivatedRouteSnapshot): Observable<any> | any {

    return of(route.params['lang'] || this.language)
      
      .pipe( switchMap( lang => {

        return this.user.asObservable().pipe( 
          first(),
          switchMap( profile => {

            if(lang === 'auto') {

              // Gets the user preferred language or detects tht browsers
              const lang = !!profile && profile.lang || this.detectLanguage().split('-')[0];
              console.log('Resolving to profile or browser language: ', lang);
              // Switch to the language
              this.router.navigate([lang]);
              return of({});
            }

            if(lang !== this.language) {
              // Applies the new locale to the auth instance
              this.user.auth.language = lang;
              // Sets the DataAdapter/moment locale accordingly
              this.adapter.setLocale( moment.locale(lang) );
            }

            // Loads he requested modules
            return this.loadModules(lang, route.data.modules)
              .pipe( 
                // Jumps to the not-found page when the requested content is missing
                catchError( () => ( this.router.navigate['not-found'], of({}) ) ),
                // Pushes the updated snapshot along the data streams
                tap( data => this._data$.next(data) )
              );
          })
        );
      }));
  }

  // Load the modules of the specified language
  private loadModules(lang: string, modules: string[]): Observable<any> { 

    // Resets the data snapshot while switching language
    if(lang !== this.language) { this.data = { lang }; }

    // Uses forkJoin to load the modules in parallel
    return forkJoin(

      modules.map( module => this.loadModule(module) ) 

    // Zips the array of resulting emissions into a single object of objects
    ).pipe( zip( objs => {

      objs.forEach(module => { 
        this.data[module.name] = module.data;
      });

      return this.data;
    }));
  }

  private loadModule(moduleName: string): Observable<{name: string, data: any}> {

    if(!!this.data && !!this.data[moduleName]) {
      console.log('Skipping reloading module: ', moduleName);
      return of(this.data[moduleName]);
    }

    console.log('Loading module: ', moduleName);

    // Starts by loading the default language module
    return this.http.get<Object>(`assets/i18n/en/${moduleName}.json`).pipe( 
      switchMap( defaultData => {
        // Stops if the requested language corresponds to the default one
        if( this.language === 'en' ) { return of(defaultData); }
        // Loads the requested language otherwise
        return this.http.get<Object>(`assets/i18n/${this.language}/${moduleName}.json`).pipe(
          // Reverts to the default language in case of errors (basically it pass an empty object 
          // since default content will be merged in the next map() )
          catchError( () => of({}) ),
          // Merges the requested language data with the default one to make sure covering missing translations
          map( requestedData => this.merge(requestedData, defaultData) )
        );
      }),
      // Maps the loaded content into a name/data pair for further use
      map(data => { return { name: moduleName, data }; })
    );
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
          //const lang = this.content.language || 'en';
          // Returns an UrlTree pointing to the login page
          return this.router.createUrlTree([this.language, 'login']); 
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

  /** 
   * Navigates to the requested location according to different strategies 
   * @param url the target location. When starting with 'http' will route to the redirection page;
   *  When starting with '#' will route to the current page applying ulr as the anchor to scroll to;
   *  Otherwise, will jump to the specified page making sure to keep the current language 
   */ 
  public navigateByUrl(url: string): Promise<boolean> {
    
    // Intercepts external links
    if(url.indexOf("http") === 0) {
      // Goes to the external rediraction page
      return this.navigate('redirect', { queryParams: { url } });
    }
    
    // Intercepts anchors
    if(url.indexOf("#") === 0) {
      // Stays in the current page scrolling to the anchor
      return this.navigate('.', { fragment: url.replace('#', '') });
    }

    // Routes to the requested page otherwise
    return this.navigate(url);
  }

  // Routing helper to easily jump on a specified page keeping the current language
  public navigate(to: string, extras?: NavigationExtras): Promise<boolean> {

    // Traslates the input string into an absolute target route keeping the current language
    const target = (to === '.') ? 
      
      this.router.url.replace(/#.*/,'').split('/') : 
      
      [ '/', this.language, to ];

    // Navigates to the target 
    return this.router.navigate( target, extras );
  }

  public detectLanguage(): string {

    const navigator: any = window.navigator || {};

    // Detects the preferred language according to the browser, whenever possible
    return (navigator.languages ? navigator.languages[0] : null) || 
            navigator.language ||                                                                                                   
            navigator.browserLanguage || 
            navigator.userLanguage;
  }

  public routerLink(lang: string): any[] {
    // Splits the current url
    const cmds = this.router.url.split('/');
    // Makes sure its absolute
    cmds[0] = '/';
    // Overwrites the language
    cmds[1] = lang;
    return cmds;
  }
  
  /**
   * Helper function to navigate to a given url switching to the specified language
   * @param lang the new language code to switch to
   * @param url the optional relative url to navigate to. The function navigates to the current position if not specified.
   */
  public switchLanguage(lang: string, url?: string): Promise<boolean> {
    // Computes the new commands
    const link = !!url ? ['/', lang, url] : this.routerLink(lang);
    //...and navigates
    return this.router.navigate(link);
  }

  private merge(localModule: any, defaultModule?: any): any {
    // Skips recurring when no default module is available
    if(!!defaultModule) {
      // Loops on the keys of the default object
      Object.keys(defaultModule).forEach( key => {
        // Add the property when undefined
        if(!localModule[key]) { localModule[key] = defaultModule[key]; }
        // Override the property on array length mismatch
        else if(defaultModule[key] instanceof Array && 
               (!(localModule[key] instanceof Array) || 
               localModule[key].length !== defaultModule[key].length)) {
          localModule[key] = defaultModule[key]; 
        }
        // Recurs down the inner objects when needed
        else if(typeof localModule[key] === 'object') {
          localModule[key] = this.merge(localModule[key], defaultModule[key]);
        }
      });
    }
    // Returns the merged object
    return localModule;
  }
}
