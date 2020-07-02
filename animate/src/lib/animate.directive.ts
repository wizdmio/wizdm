import { Directive, Input, OnChanges, SimpleChanges, Optional, Inject, ElementRef, forwardRef, NgZone } from '@angular/core';
import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { AnimateConfig, ANIMATE_CONFIG } from './animate.config'
import { AnimateService } from './animate.service';

@Directive({
  selector: '[wmAnimateView]',
   providers: [
    // Provides the AnimateDirective as the service, so, for the children components to trigger within a modified viewport
    { provide: AnimateService, useExisting: forwardRef(() => AnimateDirective) },
  ]
})
export class AnimateDirective extends AnimateService implements OnChanges {

  constructor(private elref: ElementRef<HTMLElement>,
                      scroll: ScrollDispatcher,  
                      port: ViewportRuler,
                      zone: NgZone, 
                      @Optional() @Inject(ANIMATE_CONFIG) config?: AnimateConfig) { 
    // Constructs the parent AnimateService
    super(scroll, port, zone, config); 
  }

  /** When true instructs the directive to use the element's bounding rect as the animation view */
  @Input() useElement: boolean = false;

  /** Optional top offset */
  @Input() top: number;

  /** Optional left offset */
  @Input() left: number;

  /** Optional bottom offset */
  @Input() bottom: number;

  /** Optional right offset */
  @Input() right: number;

  // Updates the AnimateService options on changes 
  ngOnChanges(changes: SimpleChanges) {

    super.setup({ 
      // Uses the host element as the container, when requested
      root: coerceBooleanProperty(this.useElement) ? this.elref.nativeElement : null,
      // Computes the optional offsets
      
      top: coerceNumberProperty(this.top, 0), 
      right: coerceNumberProperty(this.right, 0), 
      bottom: coerceNumberProperty(this.bottom, 0),
      left: coerceNumberProperty(this.left, 0)
    });
  }
}