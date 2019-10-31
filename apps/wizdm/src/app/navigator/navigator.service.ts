import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ContentLoader } from '@wizdm/content';

@Injectable({
  providedIn: 'root'
})
export class NavigatorService {

  constructor(private router: Router, private loader: ContentLoader) { }

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
    return this.navigate(url, { queryParams: this.parseParams(url) });
  }

  private parseParams(input: string): {[key: string]: string} {
    // Match for parameter pattern
    const re = /(\w+)=(\w*)\&*/g;
    const params = {};
    // Build the parameter object
    input.replace(re, (match: string, param: string, value: string) => {

      params[param] = value;
      return '';
    });

    return params;
  }

  // Routing helper to easily jump on a specified page keeping the current language
  public navigate(to: string|any[], extras?: NavigationExtras): Promise<boolean> {

    // Traslates the input string into an absolute target route keeping the current language
    const target = (to === '.') ? 
      
      this.router.url.replace(/#.*/,'').split('/') : 
      
      [ '/', this.loader.language ].concat( typeof to === 'string' ? to.split('/') : to);

    // Navigates to the target 
    return this.router.navigate( target, extras );
  }

  /**
   * Returns a router command list redirecting to the current page in a different language
   * @param lang language code you want the link for
   */
  public languageLink(lang: string): any[] {
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
    const link = !!url ? ['/', lang, url] : this.languageLink(lang);
    //...and navigates
    return this.router.navigate(link);
  }
}
