import { Injectable, OnDestroy, Optional } from '@angular/core';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { startWith } from 'rxjs/operators';
import { Subscription } from 'rxjs';

export abstract class AnimateView {

  abstract left: number;
  abstract top: number;
  abstract right: number;
  abstract bottom: number;
};

@Injectable({
  providedIn: 'root'
})
export class AnimateService implements OnDestroy {

  private sub: Subscription;
  private left: number;
  private top: number;
  private right: number;
  private bottom: number;

  constructor(viewPort: ViewportRuler, @Optional() animateView: AnimateView) {

    // Tracks for viewport changes giving it 100ms time to accurately update for orientation changes
    this.sub = viewPort.change(100).pipe( startWith(null) ).subscribe( () => {

      // Gets the viewport
      const port = viewPort.getViewportRect();

      // Updates the view area combining the viewport with the AnimateView directive
      this.left = animateView?.left || port.left;
      this.top = animateView?.top || port.top;
      this.right = animateView?.right || port.right;
      this.bottom = animateView?.bottom || port.bottom;

      console.log(this);
    });
  }

  ngOnDestroy() { this.sub.unsubscribe(); }

  // Computes the element's visibility ratio against the viewport
  public visibility(el: HTMLElement): number {

    // Gets the element's bounding rect
    const rect = el?.getBoundingClientRect();
    if(!rect) { return 0; }

    // Return 1.0 when the element is fully within the viewport
    if(rect.left >= this.left && rect.top >= this.top && rect.right < this.right + 1 && rect.bottom < this.bottom + 1) { 
      return 1; 
    }

    // Computes the intersection area otherwise
    const a = Math.round(rect.width * rect.height);
    const b = Math.max(0, Math.min(rect.right, this.right) - Math.max(rect.left, this.left));
    const c = Math.max(0, Math.min(rect.bottom, this.bottom) - Math.max(rect.top, this.top));

    // Returns the amount of visible area 
    return Math.round(b * c / a * 10) / 10;
  }
}
