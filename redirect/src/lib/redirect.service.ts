import { Injectable, Inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, NavigationExtras } from '@angular/router';
import { DOCUMENT } from '@angular/common'; 

export interface RedirectionExtras extends NavigationExtras {
  target?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RedirectService implements CanActivate {

  constructor(@Inject(DOCUMENT) readonly document: Document, readonly router: Router) { }

  /** The Window object from Document defaultView */
  get window(): Window { return this.document.defaultView || window; }

  /** Redirects instantly to the external link without the mediation of the router */
  public redirect(url: string, target: string = '_blank'): Promise<boolean> {

    return new Promise<boolean>( (resolve, reject) => {

        try { resolve(!!this.window.open(url, target)); }
        catch(e) { reject(e); }
    });
  }

  /** Returns true if the given url looks external */
  public external(url: string): boolean {
    return /^http(?:s)?:\/{2}\S+$/.test(url);
  }

  /** Parses the given url for extenral redirection */
  private externalUrl(url: string, target?: string): string {
    // Builds the redirection url for canActivate() to handle it
    return "redirect?url=" + url + (!!target ? "&=" + target : '');
  }

  /** Parses the given url for internal routing */
  private internalUrl(url: string): string {
    // Handles '#' anchors and '.' relative urls by prepending the current url from the router
    return url && url.startsWith('#') ? (this.router.url.replace(/#.*$/, '') + url) : (url && url.replace(/^\./, this.router.url));
  }

  /** Navigates to the given url, redirecting when necessary 
   * @param url An absolute URL. The function does not apply any delta to the current URL. 
   * When starting with 'http(s)://' triggers the external redirection. 
   * @param extras (optional). An object containing properties that modify the navigation strategy. 
   * The function ignores any properties that would change the provided URL. 
   */
  public navigate(url: string, extras?: RedirectionExtras): Promise<boolean> {

    // Compose the url link for redirection
    const link = this.external(url) ? this.externalUrl(url, extras?.target) : this.internalUrl(url);

    // Navigates with the router activating the redirection guard
    return this.router.navigateByUrl(link, extras);
  }

  canActivate(route: ActivatedRouteSnapshot) {

    // Gets the url query parameter, if any
    const url = route.queryParamMap.get('url');

    // If the url matches an external link, redirects stopping the route activation
    if( this.external(url) ) { 

      // Verifies whenever the external url may be redirected internally (since the origin matches)
      const rx = new RegExp(`^${this.window.location.origin}`);
      if( url.match(rx) ) { return this.router.parseUrl( url.replace(rx, '') ); }

      // Gets the optional target, when specified
      const target = route.queryParamMap.get('target');
      // Jumps to the external resource
      return this.redirect(url, target).then(() => false); 
    }
    // Goes on activating the requested route, most likely to NotFound
    return true;
  }
}