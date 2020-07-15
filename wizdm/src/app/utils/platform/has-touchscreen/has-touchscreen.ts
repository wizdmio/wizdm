import { InjectionToken } from '@angular/core';

/** HasTouchScreen injection token */
export const HasTouchScreen = new InjectionToken<boolean>('wizdm-has-touchscreen', {
  providedIn: 'root',
  factory: () => {

    const nav = window && window.navigator;
    if(!nav) { return false; } 

    if("maxTouchPoints" in nav && nav.maxTouchPoints > 0) {
      return true;
    }

    if("msMaxTouchPoints" in nav &&  nav.msMaxTouchPoints > 0) {
      return true;
    } 

    const mQ = window.matchMedia && window.matchMedia("(pointer:coarse)");
    if(mQ && mQ.media === "(pointer:coarse)") {
      return !!mQ.matches;
    }

    if("orientation" in window) {
      return true; // deprecated, but good fallback
    }

    // Only as a last resort, fall back to user agent sniffing
    return /\b(BlackBerry|webOS|iPhone|IEMobile|Android|Windows Phone|iPad|iPod)\b/i.test(nav.userAgent);
  }
});