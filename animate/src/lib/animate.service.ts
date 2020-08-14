import { map, startWith, distinctUntilChanged, take, scan, switchMap, debounceTime, shareReplay } from 'rxjs/operators';
import { AnimateConfig, ANIMATE_CONFIG, animateConfigFactory } from './animate.config'
import { Injectable, ElementRef, NgZone, Inject, Optional } from '@angular/core';
import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { Observable, BehaviorSubject, of, OperatorFunction } from 'rxjs';

/** Configures alternative containers for AOS triggering */
export interface AnimateOptions {
  
  root?: Element;
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnimateService {

  private options$ = new BehaviorSubject<AnimateOptions>({});
  private view$: Observable<ClientRect>;

  /** True when the trigger is provided using the IntersectionObserver API */
  public get useIntersectionObserver(): boolean {
    return this.config.triggerMode === 'intersectionObserver';
  }

  /** True when the trigger is provided using cdk/scrolling package */
  public get useScrolling(): boolean {
    return this.config.triggerMode === 'scrolling';
  }

  /** Applies the given options to the triggering service */
  public setup(options: AnimateOptions) {
    this.options$.next(options);
  }

  constructor(private scroll: ScrollDispatcher, private viewPort: ViewportRuler, private zone: NgZone,
  @Optional() @Inject(ANIMATE_CONFIG) private config?: AnimateConfig) {

    // Gets the module configuration
    this.config = animateConfigFactory(config);

    // Computes a common view observable to support the 'scrolling' triggering method 
    this.view$ = this.options$.pipe( 
      // Tracks for viewport changes giving it 100ms time to accurately update for orientation changes  
      switchMap( options => viewPort.change(100).pipe( 
        // Starts with a value
        startWith( null ), 
        // Gets the viewport
        map( () => {
          // Picks the ClientRect of the relevant container 
          const rt = (options.root instanceof Element) ? options.root.getBoundingClientRect() : this.viewPort.getViewportRect(); 
          // Combines the various options to build the final container
          const left = rt.left + (options.left || this.config.offsetLeft || 0);
          const top = rt.top + (options.top || this.config.offsetTop || 0);
          const right = rt.right + (options.right || this.config.offsetRight || 0);
          const bottom = rt.bottom + (options.bottom || this.config.offsetBottom || 0);
          // Returns the reultins client rect 
          return { top, left, bottom, right, height: bottom - top, width: right - left };
        }),
        // Debounces to aggregate fast changes (like during orientation changes)
        debounceTime(20), 
      )),
      // Makes all the component to share the same viewport values
      shareReplay(1)
    );
  }

  // Triggers the animation
  public trigger(elm: ElementRef<HTMLElement>, threshold: number): OperatorFunction<boolean, boolean> {

    // Waits until the zone is stable once, aka the render is complete so the element to measure is there 
    return source => this.zone.onStable.pipe( 
      // Waits just once
      take(1),
      // Triggers the play and replay requests
      switchMap( () => source ),
      // Triggers upon the most suitable method
      switchMap( trigger => 
        // Simply return the sourced trigger when threshold is 0
        (threshold <= 0) ? of(trigger) : (
          // Check upon the configured method otherwise
          this.useIntersectionObserver ? 
          // Triggers upon element intersection (IntersectionObserver API)
          this.intersecting(elm, threshold) : 
          // Triggers upon cdk/scrolling
          this.scrolling(elm ,threshold)
        )
      )
    );
  }

  // Triggers the animation on intersection (using the IntersectionObserver API)
  private intersecting(elm: ElementRef<HTMLElement>, threshold: number): Observable<boolean> {

    return this.options$.pipe(
      // Turns the options into a suitable configuration for the IntersectionObserver AnimateOptions
      map( options => {
        // Identifies an optional element to be used as the container
        const root = options.root || null;
        // Merges the margins from both the global config and the local options 
        const top = options.top || this.config.offsetTop || 0;
        const right = options.right || this.config.offsetRight || 0;
        const bottom = options.bottom || this.config.offsetBottom || 0;
        const left = options.left || this.config.offsetLeft || 0;
        // Computes the rootMargin string acordingly
        const rootMargin = `${-top}px ${-right}px ${-bottom}px ${-left}px`;
        // Returns the proper initialization object
        return { root, rootMargin } as IntersectionObserverInit;
      }),
      // Observes the element
      switchMap( options => this.observe(elm, threshold, options) )
    );
  }

  /** Builds an Obsevable out of the IntersectionObserver API */
  private observe(elm: ElementRef<HTMLElement>, threshold: number, options: IntersectionObserverInit): Observable<boolean> {

    return new Observable<boolean>( subscriber => {
      // Creates a single entry observer
      const observer = new IntersectionObserver( entries => {
        // Monitors the only enry intesection ratio 
        const ratio = entries[0].intersectionRatio;
        // Emits true whenever the intersection cross the threashold (making sure to run in the angular zone)
        if(ratio >= threshold) { this.zone.run( () => subscriber.next(true) ); }
        // Emits false whenever the intersection cross back to full invisibility (making sure to run in the angular zone)
        if(ratio <= 0) { this.zone.run( () => subscriber.next(false) ); }
      // Initializes the observer with the given parameters
      }, { ...options, threshold: [ 0, threshold ] });

      // Starts observing the target element 
      observer.observe(elm.nativeElement);
      // Disconnects when unsubscribed
      return () => observer.disconnect();
    });
  }

  // Triggers the animation on scroll
  private scrolling(elm: ElementRef<HTMLElement>, threshold: number): Observable<boolean> {
    // Returns an AOS observable using cdk/scrollilng
    return this.scroll.ancestorScrolled(elm, 0).pipe(
      // Makes sure triggering the start no matter there's no scroll event hits yet
      startWith(0),
      // Maps the scrolling to the element visibility value
      switchMap( () => this.visibility(elm) ),
      // Applies an hysteresys, so, to trigger the animation on based on the treshold while off on full invisibility
      scan((result, visiblility) => (visiblility >= threshold) || (result && visiblility > 0), false),
      // Distincts the resulting triggers 
      distinctUntilChanged(),
      // Runs within the angular zone to trigger change detection back on
      source => new Observable( subscriber => source.subscribe( value => this.zone.run( () => subscriber.next(value) ) ) )
    );
  }

  // Computes the element's visibility ratio against the container
  private visibility(elm: ElementRef<HTMLElement>): Observable<number> {

    // Resolves from the latest viewport
    return this.view$.pipe( map( view => {

      // Gets the element's bounding rect
      const rect = elm && elm.nativeElement && elm.nativeElement.getBoundingClientRect();
      if(!rect) { return 0; }

      // Return 1.0 when the element is fully within the viewport
      if(rect.left > view.left - 1 && rect.top > view.top - 1 && rect.right < view.right + 1 && rect.bottom < view.bottom + 1) { 
        return 1; 
      }

      // Computes the intersection area otherwise
      const a = Math.round(rect.width * rect.height);
      const b = Math.max(0, Math.min(rect.right, view.right) - Math.max(rect.left, view.left));
      const c = Math.max(0, Math.min(rect.bottom, view.bottom) - Math.max(rect.top, view.top));

      // Returns the amount of visible area 
      return Math.round(b * c / a * 10) / 10;
    }));
  }
}