import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ContentSelector, ContentConfigurator, AllowedContent } from '@wizdm/content';
import { switchMap, map, take, filter } from 'rxjs/operators';
import { LANGUAGE_MAP, LanguageMap } from '@wizdm/geo';
import { DarkModeObserver } from 'app/utils/platform';
import { DateAdapter } from '@angular/material/core';
import { UserProfile } from './user-profile.service';
import { Injectable, Inject } from '@angular/core';
import { IpInfo, IpListCC } from '@wizdm/ipinfo';
import { Subscription, of } from 'rxjs';
import moment from 'moment';

/**
 * Applies the User's preferences
 */
@Injectable()
export class UserPreferences extends ContentSelector {

  private get auth() { return this.user.auth; }
  private sub: Subscription;

  constructor(@Inject(LANGUAGE_MAP) private languageMap: LanguageMap, private iplist: IpInfo<IpListCC>, private adapter: DateAdapter<any>, private user: UserProfile, theme: DarkModeObserver, router: Router, config: ContentConfigurator) { 
    super(router, config); 

    // Monitors logging-in to apply user's preferences
    this.sub = this.auth.state$.pipe( 
      
      // Filters for sign-in 
      filter( user => !!user ), 
      
      // Switches to the user data waiting for the data to actually exists, this may take some time during new user registration
      switchMap( () => this.user.data$.pipe( filter( data => !!data ), take(1) ) ) 
      
    ).subscribe( data => {

      // Applies the user's theme preference when specified
      theme.darkMode(data.theme && data.theme !== 'auto' ? data.theme === 'dark' : undefined);

      // Applies user's language preference when specified
      if(data.lang) {
        
        // Evaluates the current url against the one with the desired language.
        // Note that this reg-ex does not match '/' skipping to apply any early stage changes addressed by canActivate()
        const target = router.url.replace(/^\/[^\/]+(\/|$)/, '/' + data.lang + '$1');
        if(target !== router.url) { router.navigateByUrl(target); }
      }
    });
  }

  // Disposes of the subscriptions
  ngOnDestroy() { this.sub.unsubscribe(); }

  // Implements CanActivate guarding to detect the most appropriate language to apply
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    // Resolves user profile data, when authenticated. This also prevents page flickering by delaying routing until authentication is completed
    return this.user.data$.pipe( 
      
      // Resolves the user's profile data when authenticated
      switchMap( data => {

        // Whenever authenticated, returns the user preferred language
        if(data?.lang) { return of(data.lang); }
        
        // Detects the location from the IP and returns the corresponding language falling back to the browser language
        // Note: IpInfo service caches the last value to avoid multiple API calls unless requested.
        return this.iplist.pipe( map( list => this.languageMap[list.countrycode]?.[0] || this.browserLanguage ));
      }), 

      map( detected => {

        console.log("Detected language:", detected);

        // Gets the language code from the route
        const requested = this.requestedValue(route);
        
        // Whenever the requested language is allowed...
        if( this.isValueAllowed(requested) ) { 

          console.log('Requested language:', requested);

          // Updates the authentication's locale according to the new language keeping track of the current language for further use
          this.auth.setLocale( this.config.currentValue = requested );
          // Updates the adapter's locale accordingly
          this.adapter.setLocale( moment.locale( requested ) );
          // Proceed with the routing
          return true; 
        }

        // Whenever the request is to detect the preferred language...
        if( requested === 'auto' ) {

          // Gets the preferred user language from the profile, when authenticated, or the browser otherwise
          const preferred = this.valueAllowed( detected );
          console.log('User preferred language:', preferred);

          // Patches the state url with the new language code
          const redirect = state.url.replace(/^\/[^\s\/]+/, '/' + preferred);
          console.log("Redirecting:", redirect);

          // Builds an UrlTree from the new url to redirect to
          return this.router.parseUrl(redirect);
        }

        // At this point the requested language is not supported or may be not a language at all, so, 
        // appends the full url to the current language and redirects
        const redirect = '/' + this.config.currentValue + state.url;
        console.log("Redirecting:", redirect);

        // Builds an UrlTree from the new url to redirect to
        return this.router.parseUrl(redirect);
      }),

      // Makes sure the observable completes
      take(1)
      
    ) as AllowedContent;
  }
}
