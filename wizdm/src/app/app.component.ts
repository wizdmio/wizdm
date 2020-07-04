import { Component, OnDestroy, Inject, Optional, ViewEncapsulation, ElementRef, KeyValueDiffers, Renderer2, NgZone, KeyValueDiffer } from '@angular/core';
import { trigger, animate, style, transition } from '@angular/animations';
import { Router, ResolveStart, NavigationEnd, Scroll, ExtraOptions, ROUTER_CONFIGURATION } from '@angular/router';
import { filter, map, sample, startWith, distinctUntilChanged, takeWhile } from 'rxjs/operators';
import { NgStyle, ViewportScroller } from '@angular/common';
import { BackgroundObservable } from 'app/utils/background';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fade', [
      transition(':leave', [
        animate('200ms ease-out', 
          style({ opacity: 0 })
        )] 
      )
    ])
  ]
})
export class AppComponent extends NgStyle implements OnDestroy { 
  
  readonly loading$: Observable<boolean>;
  private sub: Subscription;

  constructor(background$: BackgroundObservable,
              el: ElementRef, diffs: KeyValueDiffers, renderer: Renderer2, 
              router: Router, scroller: ViewportScroller, zone: NgZone, 
              @Optional() @Inject(ROUTER_CONFIGURATION) config: ExtraOptions) {

    // Builds the NgStyle directive
    super(el, diffs, renderer);

    // Grabs the router scrolling options
    const scrollPositionRestoration = config?.scrollPositionRestoration || 'top';
    const anchorScrolling = config?.anchorScrolling || 'enabled';

    // Disables default router scolling to avoid racing conditions
    config.scrollPositionRestoration = config.anchorScrolling = 'disabled';    

    // Overrides the router scrolling mechanism to ensure scroll events get fired when the rendering is actually done
    this.sub = router.events.pipe( filter( e => e instanceof Scroll ), sample( zone.onStable ) ).subscribe( (e: Scroll) => {

      if(e.position) { // Routing backwards

        // Scrolls to top or...
        if(scrollPositionRestoration === 'top') { scroller.scrollToPosition([0, 0]); }
        // ...scrolls to the saved position otherwise
        else if(scrollPositionRestoration === 'enabled') { scroller.scrollToPosition(e.position); }

      } else { // Routing forward
        
        // Scrolls to the given anchor or...
        if(e.anchor && anchorScrolling === 'enabled') { scroller.scrollToAnchor(e.anchor); } 
        // ...scrolls to top otherwise
        else if (scrollPositionRestoration !== 'disabled') { scroller.scrollToPosition([0, 0]); }
      }
    });

    // Applies the styles coming from BackgroundObservable
    this.sub.add( background$.subscribe( styles => {
      this.ngStyle = styles;
    }));

    // Uses router events to display the loading spinner
    this.loading$ = router.events.pipe( 
      // Filters the meaningful events only
      filter( e => e instanceof ResolveStart || e instanceof NavigationEnd ),
      // Maps the event to the boolean value
      map( e => e instanceof ResolveStart ),
      // Makes sure to start properly
      startWith(true),
      // Filters unchanged values
      distinctUntilChanged(),
      // Completes when done loading
      takeWhile( value => value, true)
    );
  }

  // Disposes of the subscription
  ngOnDestroy() { this.sub.unsubscribe(); }
}
