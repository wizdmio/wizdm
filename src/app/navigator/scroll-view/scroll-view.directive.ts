import { Directive, OnDestroy, ElementRef, HostListener, Input, Output, EventEmitter, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute, Scroll } from '@angular/router';
//import { ViewportScroller } from '@angular/common';
import { Subscription, interval, of } from 'rxjs';
import { filter, switchMap, scan, tap, takeWhile } from 'rxjs/operators';
import { ScrollViewService } from './scroll-view.service';

@Directive({
  selector: '[wmScrollView]'
})
/** 
 * Handle page scrolling within the navigator. Enables scrolling to anchor and detects when the content has been scrolled 
 * triggering the toolbar divider
 */
export class ScrollViewDirective implements OnDestroy {

  private sub$: Subscription;
  private element$: Element;
  private anchor: string;

  constructor(private scroll  : ScrollViewService,
              private element : ElementRef,
              private renderer: Renderer2,
              private router  : Router) {

    this.element$ = this.element.nativeElement;

    // Intercepts router scrolling events
    this.sub$ = this.router.events
      .pipe( filter(e => e instanceof Scroll) )
      .subscribe( (e: Scroll) => {
        if (e.anchor) {
          this.toAnchor(this.anchor = e.anchor);
          //console.log('Scroll to anchor: ', e.anchor)
        }
      });

    // Subscribes the enable/disable scrollign handler
    this.scroll.enable$.subscribe( enable => {
      this.enableScroll(enable);
    });

    // Subscribes the scrollTo element handler
    this.scroll.scrollTo$.subscribe( element => {
      this.toElement(element);
    });
  }

  ngOnDestroy() { this.sub$.unsubscribe();}

/*
  private scrollTo(target: number) {
    of(target)
      .pipe( switchMap( target => {
        return interval(100).pipe(
          scan( (sum, val) => sum + 5, this.element$.scrollTop ),
          tap( pos => { this.element$.scrollTo(0, pos); }),
          takeWhile( val => val < target )
        );
      })
    ).subscribe();
  }
*/
/*
  private clearAnchor() {
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParamsHandling: 'preserve',
      replaceUrl: true,
      fragment: null
    }).then( () => this.anchor = null);
  }
*/
  private enableScroll(enable: boolean): void {

    if(enable) {
      this.renderer.setStyle(this.element$, 'overflow', 'auto');
      this.renderer.setStyle(this.element$, 'scroll-behavior', 'smooth');
    }
    else {
      // Set the overflow style to 'unset', this should override CSS styles if any
      this.renderer.setStyle(this.element$, 'overflow', 'unset');
      this.renderer.removeStyle(this.element$, 'scroll-behavior');
    }
  }

  get position(): [number, number] {
    return [this.element$.scrollLeft, this.element$.scrollTop];
  }

  private toElement(selector: string): void {
    
    const element = this.element$.querySelector(selector);
    if(element) {
      let e = this.element$.getBoundingClientRect();
      let r = element.getBoundingClientRect();
      //this.element$.scrollBy(r.left - e.left, r.top - e.top);
      this.element$.scrollTo(this.element$.scrollLeft + r.left - e.left,this.element$.scrollTop + r.top - e.top);
      // element.scrollIntoView();
    }
  }

  private toAnchor(anchor: string): void {
    this.toElement(`#${anchor}`);
  }

  @Output('scrolled') scrolledChange = new EventEmitter<boolean>();  
  @Input() treshold = 0;

  private scrolled = false;

  @HostListener('scroll', ['$event']) onScroll(event: Event) {

    // Detects if the element has been scrolled more than 'threshold' value
    let scrolled = (this.element$.scrollTop || 0) > this.treshold;

    // Emits the scrolled status on changes
    if(this.scrolled != scrolled) {
      this.scrolledChange.emit(this.scrolled = scrolled);
    }
  }
}
