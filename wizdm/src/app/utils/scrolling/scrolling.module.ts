import { NgModule, ModuleWithProviders, Optional, Inject } from '@angular/core';
import { ScrollBehaviorDirective } from './scroll-behavior.directive';
import { ExtraOptions, ROUTER_CONFIGURATION } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@NgModule({
  declarations: [ ScrollBehaviorDirective ],
  exports: [ ScrollBehaviorDirective ],
})
export class ScrollingModule {

  constructor(scroller: ViewportScroller) {
    // we want to disable the automatic scrolling because having two places
    // responsible for scrolling results race conditions, especially given
    // that browser don't implement this behavior consistently
    scroller.setHistoryScrollRestoration('manual');
  }

  static init(config: ExtraOptions): ModuleWithProviders<ScrollingModule> {

    return {
      ngModule: ScrollingModule,
      providers: [ { provide: ROUTER_CONFIGURATION, useFactory: () => {

        // Disables default router scolling to avoid racing conditions
        const scrollPositionRestoration = 'disabled';
        const anchorScrolling = 'disabled';

        return { ...config, scrollPositionRestoration, anchorScrolling };
      }}]
    }
  }
 }
