import { Directive, Input, OnInit, OnDestroy } from '@angular/core';
import { RouterScroll } from './router-scroll.service';
import { ViewportScroller } from '@angular/common';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[scrollPositionRestoration], [anchorScrolling]'
})
export class ScrollBehaviorDirective implements OnInit, OnDestroy {

  private sub: Subscription;

  constructor(private scroller: ViewportScroller, private routerScroll$: RouterScroll) { }

  @Input() scrollPositionRestoration: 'top'|'enabled'|'disabled' = 'disabled';

  @Input() anchorScrolling: 'enabled'|'disabled' = 'disabled';

  ngOnInit() {

    this.sub = this.routerScroll$.subscribe( e => {

      if(e.position) { // Routing backwards

        // Scrolls to top or...
        if(this.scrollPositionRestoration === 'top') { 
          this.scroller.scrollToPosition([0, 0]); 
        }
        // ...scrolls to the saved position otherwise
        else if(this.scrollPositionRestoration === 'enabled') { 
          this.scroller.scrollToPosition(e.position); 
        }

      } else { // Routing forward
        
        // Scrolls to the given anchor or...
        if(e.anchor && this.anchorScrolling === 'enabled') { 
          this.scroller.scrollToAnchor(e.anchor); 
        } 
        // ...scrolls to top otherwise
        else if (this.scrollPositionRestoration !== 'disabled') { 
          this.scroller.scrollToPosition([0, 0]); 
        }
      }
    });
  }

  ngOnDestroy() { this.sub.unsubscribe(); }
}
