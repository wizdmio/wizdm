import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { map, startWith, distinctUntilChanged } from 'rxjs/operators';
import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Injectable, Inject } from '@angular/core';
import { Observable, interval, merge } from 'rxjs';

export interface ScrollInfo {
  top: number;
  bottom: number;
}

@Injectable({ providedIn: 'root' })
export class ScrollObservable extends Observable<ScrollInfo> {

  public get height(): number { 
    return this.document.body.scrollHeight || 0; 
  }

  constructor(private scroller: ViewportScroller, private ruler: ViewportRuler, @Inject(DOCUMENT) private document: Document, dispatcher: ScrollDispatcher) { 

    super( subscriber => dispatcher.scrolled(0).pipe( 
      // Always starts with a value
      startWith(null), 
      // Maps into the scroll info value
      map( () => this.scrollInfo() ),
      // Merges the scrolling emission with a 1s polling
      source => merge(source, interval(1000).pipe( map(() => this.scrollInfo() ) ) ), 
      // Filters out euqal values
      distinctUntilChanged((x,y) => x.top === y.top && x.bottom === y.bottom)

    ).subscribe( subscriber ) );
  }

  public scrollInfo(): ScrollInfo {

    const rt = this.ruler.getViewportRect();

      return {

        top: rt.top,
        bottom: this.height - rt.height - rt.top
      };
  }

  public scrollTo(pos: Partial<ScrollInfo>) {

    if(pos.top !== undefined) { 
      this.scroller.scrollToPosition([0, pos.top]); 
    }

    if(pos.bottom !== undefined) { 
      this.scroller.scrollToPosition([0, this.height - pos.bottom]); 
    }
  }
}
