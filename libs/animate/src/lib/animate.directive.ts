import { Directive, Input, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { AnimateService, AnimateView } from './animate.service';

@Directive({
  selector: '[wmAnimateView.left], [wmAnimateView.top], [wmAnimateView.right], [wmAnimateView.bottom]',
  providers: [
    
    { provide: AnimateService, useExisting: forwardRef(() => AnimateDirective) },
  ]
})
export class AnimateDirective extends AnimateService implements OnChanges {

  constructor(viewport: ViewportRuler) { super(viewport); }

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
