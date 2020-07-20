
import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Injectable, Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface ScrollInfo {
  top: number;
  bottom: number;
}

@Injectable({ providedIn: 'root' })
export class ScrollObservable extends Observable<ScrollInfo> {

  public get height(): number { 
    return this.document.body.scrollHeight || 0; 
  }

  constructor(private scroller: ViewportScroller, private ruler: ViewportRuler, @Inject(DOCUMENT) private document: Document, 
    dispatcher: ScrollDispatcher) { 

    super( subscriber => dispatcher.scrolled(0).pipe( map( () => this.scrollInfo() ) ).subscribe( subscriber ) );
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
