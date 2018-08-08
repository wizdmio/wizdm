import { Directive, OnDestroy, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Scroll } from '@angular/router';
//import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[wm-scroll-view]'
})
/** 
 * Handle page scrolling within the navigator. Enables scrolling to anchor and detects when the content has been scrolled 
 * triggering the toolbar divider
 */
export class ScrollViewDirective implements OnDestroy {

  private sub$: Subscription;
  private element$: Element;
  private anchor: string;

  constructor(private element: ElementRef, 
              private router: Router, 
              private route: ActivatedRoute) {

    this.element$ = element.nativeElement;

    // Intercepts router scrolling events
    this.sub$ = this.router.events
      .pipe( filter(e => e instanceof Scroll) )
      .subscribe( (e: Scroll) => {
        if (e.anchor) {
          this.toAnchor(this.anchor = e.anchor);
          //console.log('Scroll to anchor: ', e.anchor)
        }
      });
  }

  ngOnDestroy() { this.sub$.unsubscribe();}

  private clearAnchor() {
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParamsHandling: 'preserve',
      replaceUrl: true,
      fragment: null
    }).then( () => this.anchor = null);
  }

  get position(): [number, number] {
    return [this.element$.scrollTop, this.element$.scrollLeft];
  }

  toAnchor(anchor: string): void {

    const elSelectedById = this.element$.querySelector(`#${anchor}`);
    if(elSelectedById) {
      //let e = this.element$.getBoundingClientRect();
      //let r = elSelectedById.getBoundingClientRect();
      //this.element$.scrollBy(r.left - e.left, r.top - e.top);
      //this.element$.scrollTo(this.element$.scrollLeft + r.left - e.left,this.element$.scrollTop + r.top - e.top);
      elSelectedById.scrollIntoView();
    }
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
/*
  this.scrollToSource.switchMap(targetYPos => {
       return Observable.interval(100) 
           .scan((acc, curr) =>  acc + 5, window.pageYOffset) 
           .do(position => window.scrollTo(0, position)) /// here is where you scroll with the results from scan
           .takeWhile(val => val < targetYPos); // stop when you get to the target
  }).subscribe(); //don't forget!
  */