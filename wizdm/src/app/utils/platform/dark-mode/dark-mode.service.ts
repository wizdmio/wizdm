import { Observable, BehaviorSubject, fromEvent, combineLatest } from 'rxjs';
import { map, tap, distinctUntilChanged, startWith } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/** DarkMode observer. Emits true whenever the dark mode is detected */
@Injectable({ providedIn: 'root'})
export class DarkModeObserver extends Observable<boolean> {

  private force$ = new BehaviorSubject<boolean|undefined>(undefined);

  // The window instance
  private get window(): Window { return this.document.defaultView || window; }

  // The prefers-color-scheme media query
  private get matchMedia(): MediaQueryList {
    return this.window.matchMedia('(prefers-color-scheme: dark)');
  }

  private isDarkMode(force?: boolean): boolean {
    return typeof force === 'boolean' ? force : this.matchMedia.matches;
  }

  /** True whenever the dark mode is detected or requested */
  public get isDark(): boolean {
    return this.isDarkMode(this.force$.value);
  }

  /** Forces the dark mode to be true (or false). When 'undefined' enables dark mode OS detection */
  public darkMode(dark: boolean|undefined) { 
    this.force$.next(dark);
  }

  constructor(@Inject(DOCUMENT) private document: Document) { 
    
    // Creates an observble from the change event
    super( subscriber => combineLatest( this.force$, fromEvent(this.matchMedia, 'change').pipe(startWith(null)) ).pipe( 

        map(([force]) => this.isDarkMode(force) ),

        // Filters for value changes only
        distinctUntilChanged(),

        // Subscribes to the inner observable
      ).subscribe( subscriber )
    )
  }
}