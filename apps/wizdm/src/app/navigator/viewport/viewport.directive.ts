import { Directive, AfterViewInit, OnDestroy, ElementRef, HostListener, Input, Output, EventEmitter, Renderer2 } from '@angular/core';
import { Router, Scroll } from '@angular/router';
//import { ViewportScroller } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ViewportService } from './viewport.service';

@Directive({
  selector: '[wmViewport]'
})
/** 
 * Handle page scrolling within the navigator. Enables scrolling to anchor and detects when the content has been scrolled
 */
export class ViewportDirective implements AfterViewInit, OnDestroy {

  private sub$: Subscription;

  constructor(private viewport : ViewportService,
              private element  : ElementRef,
              private renderer : Renderer2,
              private router   : Router) {

    // Intercepts router scrolling events
    this.sub$ = this.router.events
      .pipe( filter(e => e instanceof Scroll) )
      .subscribe( (e: Scroll) => {
        if (e.anchor) {
          this.scrollToAnchor(e.anchor);
          //console.log('Scroll to anchor: ', e.anchor)
        }
      });

      // Mirrors the Viewport element to the service
      this.mirrorViewport(viewport);
  }

  mirrorViewport(mirror: ViewportService) {
    
    // Subscribes the enable/disable scrollign handler
    mirror.enableScroll$.subscribe( enable => {
      this.enableScroll(enable);
    });

    // Subscribes the scrollToElement handler
    mirror.scrollToElement$.subscribe( element => {
      this.scrollToElement(element);
    });

    // Assign the scroll position event to be shared across components
    mirror.scrollPosition = this.scrollPosition;
  }

  // Makes sure to initialize the mirrored viewport
  ngAfterViewInit() { 
    this.onScroll(null);
    this.onResize(null);
  }

  // Unsubscribe Observable
  ngOnDestroy() { this.sub$.unsubscribe();}  

  private get native(): HTMLElement {
    return this.element.nativeElement;
  }

  get position(): [number, number] {
    return [this.native.scrollLeft, this.native.scrollTop];
  }

  private mirrorPosition() {
    this.viewport.position$.next(this.position);
  }

  get rect(): ClientRect {
    return this.native.getBoundingClientRect();
  }

  private mirrorRect() {
    this.viewport.rect$.next(this.rect);
  }

  private enableScroll(enable: boolean): void {

    if(enable) {
      this.renderer.setStyle(this.native, 'overflow', 'auto');
      this.renderer.setStyle(this.native, 'scroll-behavior', 'smooth');
    }
    else {
      // Set the overflow style to 'unset', this should override CSS styles if any
      this.renderer.setStyle(this.native, 'overflow', 'unset');
      this.renderer.removeStyle(this.native, 'scroll-behavior');
    }
  }

  private scrollToAnchor(anchor: string): void {
    this.scrollToElement(`#${anchor}`);
  }

  private scrollToElement(selector: string): void {
    
    const element = this.native.querySelector(selector);
    if(element) {
      let e = this.native.getBoundingClientRect();
      let r = element.getBoundingClientRect();
      this.native.scrollTo(this.native.scrollLeft + r.left - e.left, this.native.scrollTop + r.top - e.top);
      //this.native.scrollBy(r.left - e.left, r.top - e.top);
      //element.scrollIntoView();
    }
  }

  @Input() treshold = 0;
  @Input() scrolled = false;
  @Output() scrolledChange = new EventEmitter<boolean>();  
  @Output() scrollPosition = new EventEmitter<'top' | 'bottom'>();  
  
  @HostListener('scroll', ['$event']) onScroll(event: Event) {

    try {

      const top = this.native.scrollTop;
      const height = this.native.scrollHeight;
      const offset = this.native.offsetHeight;

      if(top === 0) {
        this.scrollPosition.emit('top')
      }

      if(top > height - offset - 1) {
        this.scrollPosition.emit('bottom')
      }

      // Detects if the element has been scrolled more than 'threshold' value
      const scrolled = (top || 0) > this.treshold;

      // Emits the scrolled status on changes
      if(this.scrolled != scrolled) {
        this.scrolledChange.emit(this.scrolled = scrolled);
      }

      this.mirrorPosition();

      // Ignores errors
    } catch(err) {}
  }

  @HostListener('resize', ['$event']) onResize(event: Event) {
    this.mirrorRect();
  }
}
