import { Directive, Input, forwardRef } from '@angular/core';
import {  AnimateView, AnimateService } from './animate.service';

@Directive({
  selector: '[wmAnimateView.left], [wmAnimateView.top], [wmAnimateView.right], [wmAnimateView.bottom]',
  providers: [
    
    { provide: AnimateView, useExisting: forwardRef(() => AnimateDirective) },
    
    AnimateService 
  ]
})
export class AnimateDirective extends AnimateView {

  @Input('wmAnimateView.left') left: number;

  @Input('wmAnimateView.top') top: number;

  @Input('wmAnimateView.right') right: number;

  @Input('wmAnimateView.bottom') bottom: number;
}
