import { filter, sample, delay, shareReplay, observeOn } from 'rxjs/operators';
import { Injectable, NgZone } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { Observable, animationFrameScheduler } from 'rxjs';

/** Replays the router scrolling event globally */
@Injectable({ providedIn: 'root' })
export class RouterScroll extends Observable<Scroll> {

  private inner$: Observable<Scroll>;

  constructor(router: Router, zone: NgZone) { 

    super( subscriber => this.inner$.subscribe(subscriber) );

    this.inner$ = router.events.pipe( 
      filter( e => e instanceof Scroll ), 
      sample<Scroll>( zone.onStable ), 
      //delay(0),
      //observeOn(animationFrameScheduler), 
      shareReplay(1) 
    );
  }
}
