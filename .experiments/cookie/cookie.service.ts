import { Injectable } from '@angular/core';

@Injectable()
export class CookieService {

  constructor() { }

  // Writes a cookie. Please note that according to RFC 2965
  // the cookie key/value can't contain *, -, +, / nor white 
  // spaces 
  public put(key: string, value: string, expire: number = 1) {

    // Computes the expiry date
    let expires = new Date(Date.now() + (expire*24*60*60*1000) ).toUTCString();

    // Assign the cookie
    document.cookie = key + "=" + value + ";expires=" + expires + ";path=/";
  }

  public get(key: string): string {

    //let kk = encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&");

    // Use a regular expression to search and cleanup the cookie value
    let rx = new RegExp("(?:(?:^|.*;)\\s*" + key + "\\s*\\=\\s*([^;]*).*$)|^.*$");
    
    // Return the requested value
    return document.cookie.replace(rx, "$1");
  }
}
