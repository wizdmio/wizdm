import { Component, Inject, OnDestroy } from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ContentResolver } from '../../core';
import { Observable, Subscription, timer, interval } from 'rxjs';
import { map, take, switchMap, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'wm-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss'],
  host: { 'class': 'wm-page adjust-top content-padding' }
})
export class RedirectComponent implements OnDestroy {

  readonly msgs$: Observable<any>;
  readonly progress$: Observable<number>;
  private sub: Subscription;

  constructor(@Inject(DOCUMENT) private document: Document, 
                                private location: Location,
                                private route: ActivatedRoute,
                                content: ContentResolver) {

    // Gets the localized content resolved during routing
    this.msgs$ = content.stream('redirect'); 

    // Creates a progress observable
    this.progress$ = this.route.queryParamMap.pipe( 
      take(1),
      // Gets the delay
      map( params => this.delay(params) ),
      // Create an interval timer w/ 250ms period
      switchMap( delay => interval(250).pipe(
        // Maps the increment into % 
        map( n => n * 250 / delay * 100 ),
        // Stops when 100% 
        takeWhile( val => val <= 100 )
      )) 
    );

    // Subscribes to redirect...
    this.sub = this.route.queryParamMap.pipe( 
      // Implements a delay() like operator with variable delay time[s]
      switchMap( params => timer( this.delay(params) ).pipe( take(1), map(() => params.get('url')) ) ) 
    // Overwrites the current location jumping to the requested URL overwriting the history
    ).subscribe( url => this.document.location.replace(url) );
  }

  // Unsubscribes preventing the redirection
  ngOnDestroy() { this.sub.unsubscribe(); }

  // Helper to compute a delay[ms] from the query parameter
  private delay(params: ParamMap, defDelay: number = 3): number {
    return 1000 * (params.has('delay') ? +params.get('delay') : defDelay);
  }

  get externalUrl(): string {
    return this.route.snapshot.queryParamMap.get('url');
  }

  // Gets back to the previous page
  back() { this.location.back(); }
}
