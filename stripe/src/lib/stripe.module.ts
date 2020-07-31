import { StripeConfig, StripeConfigToken, loadStripeJS, getStripeJS, stripeFactory, stripeElementsFactory } from './stripe-factory';
import { PLATFORM_ID, NgModule, ModuleWithProviders, Inject, Optional } from '@angular/core';
import { StripeElements } from './core/elements.directive';
import { StripeConnect } from './core/connect.directive';
import { StripeControl } from './core/control.directive';
import { isPlatformBrowser } from '@angular/common';

@NgModule({
  imports: [ ],
  declarations: [ StripeControl, StripeConnect, StripeElements ],
  exports: [ StripeControl, StripeConnect, StripeElements ]
})
export class StripeModule {

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    if( !isPlatformBrowser(platformId) ) {
      throw new Error('StripeModule package supports Browsers only');
    }

    loadStripeJS();
  }

  static init(config: StripeConfig): ModuleWithProviders<StripeModule> {
    return {
      ngModule: StripeModule,
      providers: [
        
        /** Provides the global StripeConfig object */
        { provide: StripeConfigToken, useValue: config },

        /** Provides StripeJS as an injectable */ 
        { provide: 'StripeJS', useFactory: getStripeJS },

        /** Provides a Stripe instance as an injectable service */
        { provide: 'Stripe',
          useFactory: stripeFactory, 
          deps: [ [ new Optional(), new Inject(StripeConfigToken) ] ] },

        /** Provides a global StripeElements injectable reverting to Stripe.elements() in the eventuality
         * the stripe components are used without or out of a <wm-stripe-elements> container. */
        { provide: StripeElements,
          useFactory: stripeElementsFactory,
          deps: [ new Optional(), new Inject('Stripe'), [  new Optional(), new Inject(StripeConfigToken) ] ] }
      ]
    };
  } 
}