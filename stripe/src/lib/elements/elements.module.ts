import { StripeElementsDirective, STRIPE_ELEMENTS_OPTIONS } from './elements.directive';
import { PLATFORM_ID, NgModule, ModuleWithProviders, Inject } from '@angular/core';
import { StripeControlDirective } from './control.directive';
import { isPlatformBrowser } from '@angular/common';

import type { StripeElementsOptions } from '@stripe/stripe-js';

@NgModule({
  declarations: [ StripeControlDirective, StripeElementsDirective ],
  exports: [ StripeControlDirective, StripeElementsDirective ]
})
export class StripeElementsModule {

  constructor(@Inject(PLATFORM_ID) platformId: Object) {

    if( !isPlatformBrowser(platformId) ) {
      throw new Error('StripeModule package supports Browsers only');
    }
  }

  static init(options: StripeElementsOptions): ModuleWithProviders<StripeElementsModule> {
    return {
      ngModule: StripeElementsModule,
      /** Provides the global StripeElementsOptions object */
      providers: [ { provide: STRIPE_ELEMENTS_OPTIONS, useValue: options } ]
    };
  } 
}
