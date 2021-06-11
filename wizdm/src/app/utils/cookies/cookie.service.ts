import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/* Handles cookies. Please note that according to RFC 2965
 * the cookie key/value can't contain *, -, +, / nor white 
 * spaces 
*/
@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor(@Inject(DOCUMENT) private document: Document) { }

  public put(key: string, value: string, expire: number = 1) {

    // Computes the expiry date
    const expiration = new Date( Date.now() + (expire*24*60*60*1000) ).toUTCString();

    // Assign the cookie
    this.document.cookie = key + "=" + value + ";expires=" + expiration + ";path=/";
  }

  public get(key: string): string {

    // Use a regular expression to search and cleanup the cookie value
    const rx = new RegExp("(?:(?:^|.*;)\\s*" + key + "\\s*\\=\\s*([^;]*).*$)|^.*$");
    
    // Return the requested value
    return this.document.cookie.replace(rx, "$1");
  }
}
