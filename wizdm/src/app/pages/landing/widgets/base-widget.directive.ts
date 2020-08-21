import { Directive, Input } from '@angular/core';
import type { wmAnimations, wmAnimateSpeed } from '@wizdm/animate';

export interface WidgetConfig {

  type: string;
};

export interface WidgetAnimationConfig {
  
  name: wmAnimations;
  speed?: wmAnimateSpeed;
  aos?: number;
  once?: boolean;
}

@Directive({ selector: 'wm-widget' })
export abstract class WidgetDirective<T extends WidgetConfig> {

  @Input() config: T;
}
