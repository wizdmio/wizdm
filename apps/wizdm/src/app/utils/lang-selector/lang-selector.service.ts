import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { ContentSelector, ContentConfigurator, AllowedContent } from '@wizdm/content';
import { UserProfile } from '@wizdm/connect';
import { map, first } from 'rxjs/operators';

@Injectable()
export class LanguageSelector extends ContentSelector {

  constructor(private user: UserProfile, router: Router, config: ContentConfigurator){ 
    super(router, config); 
  }

  canActivate(route: ActivatedRouteSnapshot) {

    const requested = route.paramMap.get( this.config.selector );
    console.log('Requested language:', requested);

    // Resolves user profile data, when authenticated. This also prevents page flickering by delaying routing until authentication is completed
    return this.user.asObservable().pipe( 

      map( profile => {

        // Gets the preferred user language when authenticated
        const preferred = !!profile && profile.lang || '';
        console.log('User preferred language:', preferred);

        // Selects the best language among the allowed ones
        const selected = this.languageAllowed( requested === 'auto' ? preferred || this.browserLanguage : requested );
        console.log('Selected language:', selected);

        // Redirects to the selected whenever differs from the requested
        return(requested !== selected ? this.router.createUrlTree( [selected] ) : true);
      }), 
      
      first() 

    ) as AllowedContent;
  }
}
