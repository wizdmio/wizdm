import { Directive, Input, Inject, Optional, ErrorHandler, forwardRef } from '@angular/core';
import { CdkScrollable, ExtendedScrollToOptions } from '@angular/cdk/scrolling';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[wmScroll]',
  exportAs: 'wmScroll'
})
export class ScrollDirective {

  /** The window instance */
  private get window(): Window { return this.document.defaultView || window; }

  constructor(@Optional() @Inject(forwardRef(() => ScrollDirective)) private parent: ScrollDirective, 
              @Inject(DOCUMENT) private document: Document, 
              @Optional() private scrollable: CdkScrollable,
              private error: ErrorHandler) { 

    if(!scrollable) {
      throw new Error("wmScroll is meant to be used as a child of a CdkScrollable");
    }
  }

  /** Optional left scrolling offset. The value is eventually inherited from teh parent wmScroll directive.  */
  @Input() left: number = this.parent?.left || 0;

  /** Optional top scrolling offset. The value is eventually inherited from teh parent wmScroll directive.  */
  @Input() top: number = this.parent?.top || 0;

  /** Optional scrolling behavior. The value is eventually inherited from teh parent wmScroll directive. */
  @Input() behavior: ScrollBehavior = this.parent?.behavior || undefined;

  /** Scroll target */
  @Input('wmScroll') set scroll(to: string|[number, number]|HTMLElement|ExtendedScrollToOptions) {

    // Scrolls to the specified anchor
    if(typeof(to) === 'string') { this.scrollToAnchor(to); }

    // Scroll to the specified element
    else if(to instanceof HTMLElement) { this.scrollToElement(to); }

    // Scrolls to the specified position
    else { this.scrollTo(to); }
  }

  /** Scrolls to the specified left/top position */
  public scrollTo(to: [number, number]|ExtendedScrollToOptions) {

    // Skips null targets
    if(!to) { return; } 

    // Reverts the array into a top/left object
    const pos: ExtendedScrollToOptions = to instanceof Array ? ({ left: to[0], top: to[1] }) : to;

    // Skips to process empty objects
    if(Object.keys.length <= 0) { return; }

    // Applies teh offsets, if any
    if(pos.left) { pos.left -= this.left; }
    if(pos.top) { pos.top -= this.top; }

    // Applies the default behavior whenever defined
    if(this.behavior) { pos.behavior = pos.behavior || this.behavior; }

    // Scroll the scrollable
    this.scrollable.scrollTo(pos);
  }

  /** Scrolls to the specified anchor */
  public scrollToAnchor(anchor: string): void {

    // Skips null anchors
    if(!anchor) { return; }

    try { 

      // Escape anything passed to `querySelector` as it can throw errors and stop the application from working.
      anchor = this.escapeAnchor(anchor);
      
      // Scroll to the element...
      this.scrollToElement( 
        
        // Queries for ID anchors primary
        this.document.querySelector('#' + anchor ) || 

        // Queries for name anchors alternatively
        this.document.querySelector(`[name='${anchor}']`)
      )
      // Let Angular handle the error
    } catch (e) { this.error.handleError(e); }
  }

  /** Scrolls to the specified element */
  public scrollToElement(el: HTMLElement): void {

    // SKips null elements
    if(!el) { return; }

    // Gets the element position
    const rect = el.getBoundingClientRect();
    const left = rect.left + this.window.pageXOffset;
    const top = rect.top + this.window.pageYOffset;
    
    // Scroll to the position
    this.scrollTo({ left, top });
  }

  /**  Anchor escaping function */
  private escapeAnchor(anchor: string): string {

    return (this.window as any)?.CSS?.escape(anchor) || anchor.replace(/(\"|\'\ |:|\.|\[|\]|,|=)/g, '\\$1');
  }
}
