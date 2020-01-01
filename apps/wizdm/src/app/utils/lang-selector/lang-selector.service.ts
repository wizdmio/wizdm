import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { DateAdapter } from '@angular/material';
import { ContentSelector, ContentConfigurator, AllowedContent } from '@wizdm/content';
import { Member } from 'app/core/member';
import { map, first } from 'rxjs/operators';
import moment from 'moment';

/**
 * Seletcs the language
 */
@Injectable()
export class LanguageSelector extends ContentSelector {

  constructor(private adapter: DateAdapter<any>, private user: Member, router: Router, config: ContentConfigurator) { 
    super(router, config); 
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    // Resolves user profile data, when authenticated. This also prevents page flickering by delaying routing until authentication is completed
    return this.user.stream().pipe( 

      map( profile => {

        // Gets the language code from the route
        const requested = route.paramMap.get( this.config.selector );
        console.log('Requested language:', requested);

        // Whenever the requested language is allowed...
        if( this.isLanguageAllowed(requested) ) { 

          // Updates the adapter's locale according to the new language keeping track of the current language for further use
          this.adapter.setLocale( moment.locale( this.config.currentValue = requested ) );
          // Proceed with the routing
          return true; 
        }

        // Whenever the request is to detect the preferred language...
        if( requested === 'auto' ) {

          // Gets the preferred user language from the profile, when authenticated, or the browser otherwise
          const preferred = this.languageAllowed( !!profile && profile.lang || this.browserLanguage );
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
