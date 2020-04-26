import { InjectionToken } from '@angular/core';

/** Global configuration for Animate */
export interface AnimateConfig {

  triggerMode: 'scrolling'|'intersectionObserver'|'auto';
  
  offsetTop?: number;
  offsetRight?: number;
  offsetBottom?: number;
  offsetLeft?: number;
}
/** Animate config token */
export const ANIMATE_CONFIG = new InjectionToken<AnimateConfig>('wizdm.animate.config');

/** Builds the config object checking whenever the Browser support the IntersectionObserver API */
export function animateConfigFactory(value?: AnimateConfig): AnimateConfig {

  // Starts with the given mode defaulting to auto detection
  let triggerMode = value && value.triggerMode || 'auto';

  if(triggerMode === 'auto' || triggerMode === 'intersectionObserver') {

    // Checks for Browser IntersectionObserver support  
    const ioSupported = 'IntersectionObserver' in window &&
                        'IntersectionObserverEntry' in window &&
                        'intersectionRatio' in window.IntersectionObserverEntry.prototype;

    // Applies the best mode
    triggerMode = ioSupported ? 'intersectionObserver' : 'scrolling';
  }
  // Ensure to use scrolling otherwise
  else { triggerMode = 'scrolling'; }

  // Returns the config object 
  return { ...value, triggerMode };
}