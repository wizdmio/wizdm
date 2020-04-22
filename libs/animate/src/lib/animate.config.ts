import { InjectionToken } from '@angular/core';

/** Global configuration for Animate */
export interface AnimateConfig {

  mode: 'scrolling'|'intersectionObserver'|'auto';
  
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
  let mode = value && value.mode || 'auto';

  if(mode === 'auto' || mode === 'intersectionObserver') {

    // Checks for Browser IntersectionObserver support  
    const ioSupported = 'IntersectionObserver' in window &&
                        'IntersectionObserverEntry' in window &&
                        'intersectionRatio' in window.IntersectionObserverEntry.prototype;

    // Applies the best mode
    mode = ioSupported ? 'intersectionObserver' : 'scrolling';
  }
  // Ensure to use scrolling otherwise
  else { mode = 'scrolling'; }

  // Returns the config object 
  return { ...value, mode };
}