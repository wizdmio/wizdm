import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { DateAdapter } from '@angular/material/core';
import { ContentSelector, ContentConfigurator, AllowedContent } from '@wizdm/content';
import { switchMap, map, first } from 'rxjs/operators';
import { IpInfo, IpListCC } from '@wizdm/ipinfo';
import { Member } from 'app/core/member';
import { $languageMap } from './lang-map';
import { of } from 'rxjs';
import moment from 'moment';

/**
 * Seletcs the language
 */
@Injectable()
export class LanguageSelector extends ContentSelector {

  constructor(private iplist: IpInfo<IpListCC>, private adapter: DateAdapter<any>, private user: Member, router: Router, config: ContentConfigurator) { 
    super(router, config); 
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    // Resolves user profile data, when authenticated. This also prevents page flickering by delaying routing until authentication is completed
    return this.user.stream().pipe( 

      // Detects the language from the user profile
      switchMap( profile => {

        // Whenever authenticated, returns the user preferred language
        if(profile && profile.lang) { return of(profile.lang) }; 
        
        // Detects the location from the IP and returns the coresponding language falling back to the browser language
        // Note; IpInfo service caches the last value to avoid multiple API calls unless requested.
        return this.iplist.pipe( map( list => $languageMap[list.countrycode][0] || this.browserLanguage ));
      }), 

      map( detected => {

        console.log("Detected language:", detected);

        // Gets the language code from the route
        const requested = route.paramMap.get( this.config.selector );
        // Whenever the requested language is allowed...
        if( this.isLanguageAllowed(requested) ) { 

          console.log('Requested language:', requested);

          // Updates the adapter's locale according to the new language keeping track of the current language for further use
          this.adapter.setLocale( moment.locale( this.config.currentValue = requested ) );
          // Proceed with the routing
          return true; 
        }

        // Whenever the request is to detect the preferred language...
        if( requested === 'auto' ) {

          // Gets the preferred user language from the profile, when authenticated, or the browser otherwise
          const preferred = this.languageAllowed( detected );
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
      first()
      
    ) as AllowedContent;
  }
}
