import { Injectable, OnDestroy } from '@angular/core';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { startWith, map, debounceTime, shareReplay } from 'rxjs/operators';

export interface AnimateView {

  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnimateService {

  private update$ = new BehaviorSubject<AnimateView>(null);
  
  private view$: Observable<AnimateView>;

  constructor(viewPort: ViewportRuler) {

    // Tracks for viewport changes giving it 100ms time to accurately update for orientation changes
    this.view$ = combineLatest( this.update$, viewPort.change(100).pipe( 
      
      startWith( viewPort.getViewportRect() ), 
    
      map( () => viewPort.getViewportRect() )

    )).pipe( debounceTime(20), map( ([view, port]) => {

      // Updates the view area combining the viewport with the updated value from AnimateView directive
      const left = view?.left || port.left;
      const top = view?.top || port.top;
      const right = view?.right || port.right;
      const bottom = view?.bottom || port.bottom;

      return { left, top, right, bottom };

      // Makes all the component to share the same viewport values
    }), shareReplay(1) );
  }

  public update(view: AnimateView) { 
    this.update$.next(view); 
  }

  // Computes the element's visibility ratio against the viewport
  public visibility(el: HTMLElement): Observable<number> {

    // Resolves from the latest viewport
    return this.view$.pipe( map( view => {

      // Gets the element's bounding rect
      const rect = el?.getBoundingClientRect();
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
