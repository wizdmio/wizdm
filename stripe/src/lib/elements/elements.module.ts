import { StripeElementsDirective, StripeElementsConfig, STRIPE_ELEMENTS_CONFIG } from './elements.directive';
import { PLATFORM_ID, NgModule, ModuleWithProviders, Inject } from '@angular/core';
import { StripeControlDirective } from './control.directive';
import { isPlatformBrowser } from '@angular/common';

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

  static init(config: StripeElementsConfig): ModuleWithProviders<StripeElementsModule> {
    return {
      ngModule: StripeElementsModule,
      /** Provides the global StripeElementsConfig object */
      providers: [ { provide: STRIPE_ELEMENTS_CONFIG, useValue: config } ]
    };
  } 
}
