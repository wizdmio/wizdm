import { Directive, Input, OnChanges, SimpleChanges, forwardRef, NgZone } from '@angular/core';
import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { AnimateService, AnimateView } from './animate.service';

@Directive({
  selector: '[wmAnimateView.left], [wmAnimateView.top], [wmAnimateView.right], [wmAnimateView.bottom]',
  providers: [
    // Provides the AnimateDirective as the service, so, for the child component to trigger within a modified viewport
    { provide: AnimateService, useExisting: forwardRef(() => AnimateDirective) },
  ]
})
export class AnimateDirective extends AnimateService implements OnChanges {

  constructor(scroll: ScrollDispatcher, viewport: ViewportRuler, zone: NgZone) { super(scroll, viewport, zone); }

  @Input('wmAnimateView.left') left: number;

  @Input('wmAnimateView.top') top: number;

  @Input('wmAnimateView.right') right: number;

  @Input('wmAnimateView.bottom') bottom: number;

  ngOnChanges(changes: SimpleChanges) {

    // Maps the input changes into an AnimateView object
    const value: AnimateView = Object.keys(changes).reduce( (value, key) => {

      value[key] = changes[key].currentValue;

      return value;

    }, {});

    this.update(value);
  }
}
