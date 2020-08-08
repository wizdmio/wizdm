import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ContentSelector, ContentConfigurator, AllowedContent } from '@wizdm/content';
import { DarkModeObserver } from 'app/utils/platform';
import { switchMap, map, take } from 'rxjs/operators';
import { DateAdapter } from '@angular/material/core';
import { UserProfile } from './user-profile.service';
import { IpInfo, IpListCC } from '@wizdm/ipinfo';
import { Injectable } from '@angular/core';
import { $languageMap } from './lang-map';
import { Observable, of } from 'rxjs';
import moment from 'moment';

/**
 * Applies the User's preferences
 */
@Injectable()
export class UserPreferences extends ContentSelector {

  private get auth() { return this.user.auth; }

  constructor(private iplist: IpInfo<IpListCC>, private adapter: DateAdapter<any>, private user: UserProfile, private theme: DarkModeObserver, router: Router, config: ContentConfigurator) { 
    super(router, config); 

    // Gets the user's preferred language filtering for real changes only
    //this.userLang = this.user.data$.pipe( map( profile => profile && profile.lang ), distinctUntilChanged() );
  }

  // Implements CanActivate guarding to detect the most appropriate language to apply
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    // Resolves user profile data, when authenticated. This also prevents page flickering by delaying routing until authentication is completed
    return this.user.data$.pipe( 
      
      // Resolves the user's profile data when authenticated
      switchMap( data => {

        // Applies the user's theme preference when specified
        if(data?.theme !== 'auto') { 
          this.theme.darkMode( data.theme === 'dark'); 
        }

        // Whenever authenticated, returns the user preferred language
        if(data?.lang) { return of(data.lang); }
        
        // Detects the location from the IP and returns the corresponding language falling back to the browser language
        // Note: IpInfo service caches the last value to avoid multiple API calls unless requested.
        return this.iplist.pipe( map( list => $languageMap[list.countrycode]?.[0] || this.browserLanguage ));
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
