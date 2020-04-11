import { Directive, Input, Optional } from '@angular/core';
import { ExtendedScrollToOptions, ScrollDispatcher } from '@angular/cdk/scrolling';
import { ScrollableDirective } from './scrollable.directive';

/** Directs the target scrollable */
@Directive({
  selector: '[wmScroll]',
  exportAs: 'wmScroll'
})
export class ScrollDirective {

  constructor(@Optional() private scrollable: ScrollableDirective, private dispatcher: ScrollDispatcher) {

    if(!scrollable) {
      throw new Error("wmScroll is meant to be used as a child or sibling of a ScrollableDirective");
    }
  }

  /** Optional scrollable target the scrolling is addressed to */
  @Input() set target(name: string) {

    this.scrollable = this.seekForScrollableTarget(name);
  }

  /** Optional scrolling behavior */
  @Input() behavior: ScrollBehavior;

  /** Scroll target */
  @Input('wmScroll') set scroll(to: string|[number, number]|HTMLElement|ExtendedScrollToOptions) {

    // Reverts the array into a ExtendedScrollToOptions when needed
    const pos = to instanceof Array ? ({ left: to[0], top: to[1] } as ExtendedScrollToOptions) : to;

    // Scrolls to the specified anchor
    if(typeof(pos) === 'string') { this.scrollable.scrollToAnchor(pos, this.behavior); }

    // Scroll to the specified element
    else if(pos instanceof HTMLElement) { this.scrollable.scrollToElement(pos, this.behavior); }

    // Scrolls to the specified position
    else { this.scrollable.scrollTo({ ...pos, behavior: this.behavior || pos.behavior }); }
  }

  /** Searches for the target ScrollableDirective */
  private seekForScrollableTarget(name: string): ScrollableDirective {

    if(!name) { return this.scrollable; }

    // Uses the ScrollDispatcher container's map
    const containers = [...this.dispatcher.scrollContainers.entries()];

    // Seeks for the taget aaong the registered cdkScrollable
    const target = containers.find( scroll => (scroll[0] as ScrollableDirective).name === name )?.[0] as ScrollableDirective

    // Returns the target reverting to the parent directive when missing
    return target || this.scrollable;
  }
}
