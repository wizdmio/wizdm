import { Injectable, Inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ContentConfigurator } from '../loader/content-configurator.service';

/** Default language code resolver. The language code is expected to be a ':lang' param of the root route first child.
 * e.g. https://whatever.io/:lang/home where :lang is a two digit country code: 'en', 'it', 'ru', ... */
 @Injectable()
 export class SelectorResolver implements Resolve<string> {

  constructor(readonly config: ContentConfigurator) {}

  public resolve(route: ActivatedRouteSnapshot): string {
     // Stops recurring up returning the default language 
    if(!route) { return this.config.currentValue; }
    // Returns the language code from the param map recurring up till the root when needed
    return route.paramMap.get( this.config.selector ) || this.resolve( route.parent );
  }
}