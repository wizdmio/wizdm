import { Injectable, ElementRef, NgZone } from '@angular/core';
import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { Observable, of, OperatorFunction } from 'rxjs';
import { map, startWith, distinctUntilChanged, first, scan, switchMap, debounceTime, shareReplay } from 'rxjs/operators';

/** Returns an observable mirroring the source while running within the given zone */
export function runInZone<T>(zone: NgZone): OperatorFunction<T, T> {
  return source => {
    return new Observable( observer => {
      return source.subscribe(
        (value: T) => zone.run(() => observer.next(value)),
        (e: any) => zone.run(() => observer.error(e)),
        () => zone.run(() => observer.complete())
      );
    });
  };
}

@Injectable({
  providedIn: 'root'
})
export class AnimateService {

  private view$: Observable<ClientRect>;

  // By default, use the viewport rectangle
  protected get viewRect(): ClientRect {
    return this.viewPort.getViewportRect();
  }

  constructor(readonly scroll: ScrollDispatcher, readonly viewPort: ViewportRuler, private zone: NgZone) {

    // Tracks for viewport changes giving it 100ms time to accurately update for orientation changes
    this.view$ = viewPort.change(100).pipe( 
      
      startWith( null ), 
    
      map( () => this.viewRect ),

      debounceTime(20), 
      // Makes all the component to share the same viewport values
      shareReplay(1) 
    );
  }

  // Triggers the animation
  public trigger(elm: ElementRef<HTMLElement>, threshold: number): OperatorFunction<boolean, boolean> {

    // Waits until the zone is stable once, aka the render is complete so the element to measure is there 
    return source => this.zone.onStable.pipe( 
      // Waits just once
      first(),
      // Triggers the play and replay requests
      switchMap( () => source ),
      // Triggers the while scrolling
      switchMap( trigger => threshold > 0 ? this.aos(elm, threshold) : of(trigger) ) 
    );
  }

  // Triggers the animation on scroll
  private aos(elm: ElementRef<HTMLElement>, threshold: number): Observable<boolean> {

    // Returns an AOS observable
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
      runInZone(this.zone)
    );
  }
  // Computes the element's visibility ratio against the viewport
  private visibility(elm: ElementRef<HTMLElement>): Observable<number> {

    // Resolves from the latest viewport
    return this.view$.pipe( map( view => {

      // Gets the element's bounding rect
      const rect = elm && elm.nativeElement && elm.nativeElement.getBoundingClientRect();
      if(!rect) { return 0; }

      // Return 1.0 when the element is fully within the viewport
      if(rect.left >= view.left && rect.top >= view.top && rect.right < view.right + 1 && rect.bottom < view.bottom + 1) { 
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