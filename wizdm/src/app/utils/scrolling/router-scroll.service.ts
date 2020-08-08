import { filter, scan, tap, map, shareReplay, withLatestFrom } from 'rxjs/operators';
import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { Router, NavigationStart, Scroll } from '@angular/router';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { onStable } from '@wizdm/rxjs'

/** Replays the router scrolling event globally */
@Injectable({ providedIn: 'root' })
export class RouterScroll extends Observable<Scroll> implements OnDestroy {

  private inner$: Observable<Scroll>;
  private sub: Subscription;

  constructor(private router: Router, zone: NgZone) { 

    // Subscribes to the inner observable
    super( subscriber => this.inner$.subscribe(subscriber) );

    // Builds the inner observable
    this.inner$ = router.events.pipe( 
      
      // Filters for the Scroll events
      filter<Scroll>( e => e instanceof Scroll ),

      // Tracks the source url on NavigationStart
      withLatestFrom( router.events.pipe( filter( e => e instanceof NavigationStart ), map( () => this.router.url ) ) ),

      // Filters out emission towards the same url independently from the language (first segment)
      filter( ([ scroll, start ]) => {

        // Picks the destination url...
        const end = scroll.routerEvent.urlAfterRedirects || scroll.routerEvent.url;

        // Compares the source and dest urls
        return start.replace(/^\/[^/]+/, '') !== end.replace(/^\/[^/]+/, '');
      }), 

      // Extracts the Scroll event only
      map( ([scroll]) => scroll ),

      // Waits to emit until the NgZone is stable (aka rendering completed)
      onStable(zone),

      // Replays the same last valu to every subscriber
      shareReplay(1)
    );

    // Subscribes to keep the latest scroll event up to date
    this.sub = this.inner$.subscribe( /* scroll => console.log('Last Scroll Value:', scroll) */ );
  }

  // Disposes of the subscription
  ngOnDestroy() { this.sub.unsubscribe(); }
}
