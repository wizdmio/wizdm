import type { wmAnimations, wmAnimateSpeed } from '@wizdm/animate';
import { Directive, Input } from '@angular/core';

/** General widget configuration */
export interface WidgetConfig {

  type: string;
};

/** General widget animation configuration */
export interface WidgetAnimationConfig {
  
  name: wmAnimations;
  speed?: wmAnimateSpeed;
  aos?: number;
  once?: boolean;
}

/** Base widget directive */
@Directive({ selector: 'wm-widget' })
export abstract class WidgetDirective<T extends WidgetConfig> {

  @Input() config: T;
}
