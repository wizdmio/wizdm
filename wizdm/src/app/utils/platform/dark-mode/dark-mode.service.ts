import { Observable, BehaviorSubject, fromEvent, fromEventPattern, combineLatest } from 'rxjs';
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
  readonly mq = this.window.matchMedia('(prefers-color-scheme: dark)');

  private isDarkMode(force?: boolean): boolean {
    return typeof force === 'boolean' ? force : this.mq.matches;
  }

  /** True whenever the dark mode is detected or requested */
  public get isDark(): boolean {
    return this.isDarkMode(this.force$.value);
  }

  /** Forces the dark mode to be true (or false). When 'undefined' enables dark mode OS detection */
  public darkMode(dark: boolean|undefined) { 
    this.force$.next(dark);
  }

  /** Builds the media observer for the dark theme */
  private darkObserver(): Observable<Event> {

    // On modern browsers MediaQuelyList inherit from EventTarget...
    return (this.mq as any instanceof EventTarget) ? fromEvent(this.mq, 'change') : 
      //... while older browsers may still rely on deprecated addListener/RemoveListener functions
      fromEventPattern<MediaQueryListEvent>(this.mq.addListener.bind(this.mq), this.mq.removeListener.bind(this.mq));
  }

  constructor(@Inject(DOCUMENT) private document: Document) { 
    
    // Creates an observble combining the forcing flag with the media query
    super( subscriber => combineLatest( this.force$, this.darkObserver().pipe(startWith(null)) ).pipe( 
        // Checks for the media match
        map(([force]) => this.isDarkMode(force) ),
        // Filters for value changes only
        distinctUntilChanged(),
        // Subscribes to the inner observable
      ).subscribe( subscriber )
    )
  }
}