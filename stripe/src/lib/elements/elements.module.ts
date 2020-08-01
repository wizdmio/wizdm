import { STRIPE_ELEMENTS_CONFIG, StripeElementsConfig, stripeElementsFactory } from './elements-factory';
import { PLATFORM_ID, NgModule, ModuleWithProviders, Inject, Optional } from '@angular/core';
import { StripeElements } from './elements.directive';
import { StripeControl } from './control.directive';
import { isPlatformBrowser } from '@angular/common';

@NgModule({
  declarations: [ StripeControl, StripeElements ],
  exports: [ StripeControl, StripeElements ],
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
      providers: [
        
        /** Provides the global StripeElementsConfig object */
        { provide: STRIPE_ELEMENTS_CONFIG, useValue: config },

        /** Provides a global StripeElements injectable reverting to Stripe.elements() in the eventuality
         * the stripe components are used without or out of a <wm-stripe-elements> container. */
        { provide: StripeElements,
          useFactory: stripeElementsFactory,
          deps: [ new Optional(), new Inject('Stripe'), [  new Optional(), new Inject(STRIPE_ELEMENTS_CONFIG) ] ] }
      ]
    };
  } 
}
