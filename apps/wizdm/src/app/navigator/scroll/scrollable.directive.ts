import { Directive, Input, Inject, Optional, ElementRef, NgZone, ErrorHandler } from '@angular/core';
import { CdkScrollable, ScrollDispatcher, ExtendedScrollToOptions } from '@angular/cdk/scrolling';
import { Directionality } from '@angular/cdk/bidi';
import { DOCUMENT } from '@angular/common';
import { first } from 'rxjs/operators';

/** Extends CdkScrollable directive with strollToElement and scrollToAnchor capabilities */
@Directive({
  selector: '[wmScrollable]',
  host: { 'style': 'overflow: auto' }
})
export class ScrollableDirective extends CdkScrollable {

  /** Optional name */
  @Input('wmScrollable') name: string;

  /** Optional left scrolling offset */
  @Input() left: number = 0;

  /** Optional top scrolling offset */
  @Input() top: number = 0;

  /** Optional scrolling behavior */
  @Input() behavior: ScrollBehavior = undefined;

  /** The window instance */
  private get window(): Window { return this.document.defaultView || window; }

  /** The host element */
  private get element(): HTMLElement { return this.elref.nativeElement; }

  constructor(@Inject(DOCUMENT) private document: Document, private error: ErrorHandler, private elref: ElementRef<HTMLElement>, 
    scroll: ScrollDispatcher, private zone: NgZone, @Optional() dir: Directionality) {

    // Constructs the parent CdkScollable directive
    super(elref, scroll, zone, dir);
   }

   /** Scrolls to the specified left/top position */
  public scrollTo(to: ExtendedScrollToOptions) {

    // Skips null targets
    if(!to) { return; } 

    // Applies th offsets, if any
    if(to.left) { to.left -= this.left; }
    if(to.top) { to.top -= this.top; }

    // Applies the defaulet behavior whenever defined
    if(this.behavior) { to.behavior = to.behavior || this.behavior; }

    // Scroll the cdkScrollable
    super.scrollTo(to);
  }

  /** Scrolls to the specified anchor */
  public scrollToAnchor(anchor: string, behavior?: ScrollBehavior): void {

    // Skips null anchors
    if(!anchor) { return; }

    try { 

      // Escape anything passed to `querySelector` as it can throw errors and stop the application from working.
      anchor = this.escapeAnchor(anchor);

      // Runs the scrolling once the rendering has completed making sure the element we are querying for is actually there
      this.zone.onStable.pipe( first() ).subscribe( () => this.scrollToElement( 
        // Queries for ID anchors primary
        this.document.querySelector('#' + anchor ) || 
        // Queries for name anchors alternatively
        this.document.querySelector(`[name='${anchor}']`),
        // Applies a custom behavior on request
        behavior
      ));
      // Let Angular handle the error
    } catch (e) { this.error.handleError(e); }
  }

  /** Scrolls to the specified element */
  public scrollToElement(el: HTMLElement, behavior?: ScrollBehavior): void {

    // SKips null elements
    if(!el) { return; }

    // Gets the scrollable container position first
    const container = this.element.getBoundingClientRect();

    // Gets the element position
    const rect = el.getBoundingClientRect();
    const left = rect.left - container.left;
    const top = rect.top - container.top;
    
    // Scroll to the position
    this.scrollTo({ left, top, behavior });    
  }

  /**  Anchor escaping function */
  private escapeAnchor(anchor: string): string {

    return (this.window as any)?.CSS?.escape(anchor) || anchor.replace(/(\"|\'\ |:|\.|\[|\]|,|=)/g, '\\$1');
  }
}
