import { Directive, Input, Inject, Optional, NgZone, ErrorHandler } from '@angular/core';
import { CdkScrollable, ScrollDispatcher, ExtendedScrollToOptions } from '@angular/cdk/scrolling';
import { DOCUMENT } from '@angular/common';
import { first } from 'rxjs/operators';

/** Directs the target scrollable */
@Directive({
  selector: '[wmScroll]',
  exportAs: 'wmScroll'
})
export class ScrollDirective {

  /** The window instance */
  private get window(): Window { return this.document.defaultView || window; }

  constructor(@Inject(DOCUMENT) private document: Document, 
              @Optional() private scrollable: CdkScrollable,            
              private dispatcher: ScrollDispatcher,
              private error: ErrorHandler, 
              private zone: NgZone) {}

  /** Optional scrollable target the scrolling is addressed to */
  @Input() set target(name: string) {

    this.scrollable = this.seekForScrollableTarget(name);
  }

  /** Optional scrolling behavior */
  @Input() behavior: ScrollBehavior;

  /** Scroll target */
  @Input('wmScroll') set scroll(to: string|[number, number]|HTMLElement|ExtendedScrollToOptions) {

    // Makes sure the rendering completed first
    this.zone.onStable.pipe( first() ).subscribe ( () => {

      // Scrolls to the specified anchor
      if(typeof(to) === 'string') { this.scrollToAnchor(to); }

      // Scroll to the specified element
      else if(to instanceof HTMLElement) { this.scrollToElement(to); }

      // Scrolls to the specified position
      else { this.scrollable?.scrollTo(to instanceof Array ? ({ left: to[0], top: to[1] } ) : to); }

    });
  }

  /** Searches for the target ScrollableDirective */
  private seekForScrollableTarget(name: string): CdkScrollable {

    // When no name is specified, reverts to the parent scrollable, if any
    if(!name) { return this.scrollable; }

    // Uses the ScrollDispatcher container's map
    const containers = [...this.dispatcher.scrollContainers.entries()];

    // Seeks for the taget among the registered cdkScrollable by the 'name' attribute
    return containers.find( scroll => scroll[0].getElementRef().nativeElement?.getAttribute('name') === name )?.[0];
  }

  /** Scrolls to the specified anchor */
  public scrollToAnchor(anchor: string): void {

    // Skips null anchors
    if(!anchor) { return; }

    try { 

      // Escape anything passed to `querySelector` as it can throw errors and stop the application from working.
      anchor = this.escapeAnchor(anchor);

      // Runs the scrolling once the rendering has completed making sure the element we are querying for is actually there
      this.scrollToElement( 
        // Queries for ID anchors primary
        this.document.querySelector('#' + anchor ) || 
        // Queries for name anchors alternatively
        this.document.querySelector(`[name='${anchor}']`)
      );
      // Let Angular handle the error
    } catch (e) { this.error.handleError(e); }
  }

  /** Scrolls to the specified element */
  public scrollToElement(el: HTMLElement): void {

    // SKips null elements
    if(!el || !this.scrollable) { return; }

    // Gets the scrollable container first
    const container = this.scrollable.getElementRef().nativeElement?.getBoundingClientRect();

    // Gets the element position
    const rect = el.getBoundingClientRect();
    const left = rect.left - (container?.left || 0);
    const top = rect.top - (container?.top || 0);
    
    // Scrolls to the position
    this.scrollable.scrollTo( {left, top } );
  }

  /**  Anchor escaping function */
  private escapeAnchor(anchor: string): string {

    return (this.window as any)?.CSS?.escape(anchor) || anchor.replace(/(\"|\'\ |:|\.|\[|\]|,|=)/g, '\\$1');
  }
}
