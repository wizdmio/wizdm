import { Injectable, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

function _window() : any {
   // return the global native browser window object
   return window;
}

@Injectable()
export class WindowRef {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Simple service to provide the global window object via DI
  get nativeWindow(): any { 
    //return isPlatformBrowser(this.platformId) ? window : new Object(); 
    return _window();
  }

  get navigator(): any {

    let window = this.nativeWindow;

    return (typeof window === 'undefined' || typeof window.navigator === 'undefined') ?
      undefined : window.navigator;
  }
}
