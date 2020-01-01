import { Injectable, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, Subject, fromEvent, combineLatest } from 'rxjs';
import { takeUntil, map, startWith } from 'rxjs/operators';

/**
 * Service to interacts with the main navigation scroll view
 */
@Injectable({
  providedIn: 'root'
})
export class ViewportService implements OnDestroy {

  private dispose$ = new Subject<void>();

  /** Scroll event observable reporting position as [scrollX, scrollY] */
  readonly scroll$: Observable<[number, number]>;
  
  /** Resize event observable reporting size as [clientW, clientH] */
  readonly resize$: Observable<[number, number]>;

  /** scrollY observable  reporting the current distance from top/bottom as [top, bottom]*/
  readonly scrollY$: Observable<[number, number]>;

  constructor(@Inject(DOCUMENT) readonly document: Document) {

    // Creates the window:scroll event observable
    this.scroll$ = fromEvent(this.window, 'scroll')
      .pipe( 
        takeUntil( this.dispose$ ),
        map( () => this.position ),
        startWith( this.position )
      );

    // Cerats the window:resize event observable
    this.resize$ = fromEvent(this.window, 'resize')
      .pipe( 
        takeUntil( this.dispose$ ),
        map( () => this.size ),
        startWith( this.size )
      );

    // Combines scroll and resize events to track for scrolling disances to viewport's top and bottom
    this.scrollY$ = combineLatest( this.scroll$, this.resize$ )
      .pipe( 
        takeUntil( this.dispose$ ),
        map( () => {

          const top = this.scrollY;
          const height = this.body.scrollHeight;
          const offset = this.body.offsetHeight;
    
          // Returns the distance from top and bottom rispectievely
          return [top, (height - offset - top)] as [number, number];
        })
      );
  }

  // Returns the window object
  public get window(): Window {
    return this.document.defaultView;
  }

  /** Returns the body element */
  public get body(): HTMLElement {
    return this.document.body;
  }

  public get clientTop(): number {
    return this.body.clientTop;
  }

  public get clientLeft(): number {
    return this.body.clientLeft;
  }

  private get scrollX(): number {
    return this.window.scrollX || this.window.pageXOffset;
  }

  private get scrollY(): number {
    return this.window.scrollY || this.window.pageYOffset;
  }

  public get position(): [ number, number ] {
    return [ this.scrollX, this.scrollY ];
  }

  public get size(): [number, number ] {
    return [ this.body.clientWidth, this.body.clientHeight ];
  }

  ngOnDestroy() { 
    this.dispose$.next();
    this.dispose$.complete();
  }
  /**
   * Used to scroll the content of the navigation view at a specific position
   * @param selector a query selector pointing the lement to be shown by scrollIntoView()
   */
  public scrollToElement(selector: string): void {
    
    const element = this.document.querySelector(selector);
    if(element) {
      //let e = this.body.getBoundingClientRect();
      //let r = element.getBoundingClientRect();
      //this.window.scrollTo(this.scrollX + r.left - e.left, this.scrollY + r.top - e.top);
      //this.native.scrollBy(r.left - e.left, r.top - e.top);
      element.scrollIntoView();
    }
  }

  public scrollToAnchor(anchor: string): void {
    this.scrollToElement(`#${anchor}`);
  }
}
