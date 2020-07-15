import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, fromEvent } from 'rxjs';
import { map, tap, startWith } from 'rxjs/operators';

/** DarkMode observer. Emits true whenever the dark mode is detected */
@Injectable({ providedIn: 'root'})
export class DarkModeObserver extends Observable<boolean> {

  // The window instance
  private get window(): Window { return this.document.defaultView || window; }

  // The prefers-color-scheme media query
  private get matchMedia(): MediaQueryList {
    return this.window.matchMedia('(prefers-color-scheme: dark)');
  }

  /** True whenever the dark mode is detected */
  public get isDark(): boolean {
    return this.matchMedia.matches;
  }

  constructor(@Inject(DOCUMENT) private document: Document) { 
    super( subscriber => {
      // Creates an observble from the change event
      return fromEvent(this.matchMedia, 'change').pipe( 
        // Maps the change to the darkmode flag
        startWith(null), map(() => this.isDark),
        // Debug
        tap( dark => console.log(dark ? 'Dark mode' : 'Light mode') )
        // Subscribes to the inner observable
      ).subscribe( subscriber );
    });
  }
}