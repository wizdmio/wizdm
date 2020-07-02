import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface ScrollInfo {
  top: number;
  bottom: number;
}

@Injectable({
  providedIn: 'root'
})
export class ScrollObservable extends Observable<ScrollInfo> {

  constructor(@Inject(DOCUMENT) document: Document, dispatcher: ScrollDispatcher, ruler: ViewportRuler) { 

    super( subscriber => dispatcher.scrolled(0).pipe( map( () => {

      const rt = ruler.getViewportRect();

      return {

        top: rt.top,
        bottom: document.body.scrollHeight - rt.height - rt.top
      };

    })).subscribe( subscriber ) );
  }
}
