import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ContentConfigurator } from '../loader/content-configurator.service';
import { Observable } from 'rxjs';

export type AllowedContent = Observable<true|UrlTree>|Promise<true|UrlTree>|true|UrlTree;

@Injectable()
/** Default ContentSelector reverting to the browser language if 'auto' has been specified  */
export class ContentSelector implements CanActivate {

  constructor(readonly router: Router, readonly config: ContentConfigurator){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): AllowedContent {

    // Gets the language code requested from the route 
    const requested = route.paramMap.get( this.config.selector );
    console.log('Requested language:', requested);

    // Selects the best language among the allowed ones 
    const selected = this.valueAllowed( requested === 'auto' ? this.browserLanguage : requested );
    console.log('Selected language:', selected);

    // Keeps track of the currently selected language within the ContentConfigurator for other services to take advantage from
    this.config.currentValue = selected;

    // Redirects to the selected whenever differs from the requested
    return(requested !== selected ? this.router.createUrlTree([selected]) : true) as AllowedContent;
  }

  /** Checks if the language code is among the allowed ones */
  protected isValueAllowed(value: string): boolean {
    return !!this.config.supportedValues.find( allowed => allowed === value );
  }

  /** Filters the language code ensuring is among the allowed ones returning the default value otherwise*/
  protected valueAllowed(value: string): string {
    return this.config.supportedValues.find( allowed => allowed === value ) || this.config.defaultValue;
  }

  /** Two digits browser language code */
  protected get browserLanguage(): string { 
    
    const detected = this.detectLanguage().split('-')[0];
    console.log("Detected language:", detected);

    return detected;
  }

  /** Detects the preferred language according to the browser, whenever possible */
  protected detectLanguage(): string {

    const navigator: any = !!window && window.navigator || {};

    return (navigator.languages ? navigator.languages[0] : null) || 
            navigator.language ||                                                                                                   
            navigator.browserLanguage || 
            navigator.userLanguage || '';
  }
}