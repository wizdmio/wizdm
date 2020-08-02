import { STRIPE_PUBLIC_KEY, STRIPE_OPTIONS, STRIPEJS, STRIPE, loadStripeJS, getStripeJS, stripeFactory } from './stripe-factory';
import { NgModule, ModuleWithProviders, Inject, Optional } from '@angular/core';
import type { StripeConstructorOptions } from '@stripe/stripe-js';
import { StripeConnect } from './connect/connect.directive';

@NgModule({
  imports: [ ],
  declarations: [ StripeConnect ],
  exports: [ StripeConnect ]
})
export class StripeModule {

  constructor(@Optional() @Inject(STRIPE_PUBLIC_KEY) publicKey) {

    if(!publicKey) {
      throw new Error(`
        Stripe module has not been initialized.
        Make sure to call StripeModule.init('pk_xxxxxxxxx') in your root module.
      `);
    }

    // Triggers the stripe.js API loading asyncronously. Use this function as a resolver or guard
    // to ensure the availability of the Stripe instance when needed. It can be used as an 
    // APP_INITIALIZER too but likely impacting on the app starting up latency.
    loadStripeJS();
  }

  static init(publicKey: string, options?: StripeConstructorOptions): ModuleWithProviders<StripeModule> {
    return {
      ngModule: StripeModule,
      providers: [
        
        /** Provides the global Stripe public key */
        { provide: STRIPE_PUBLIC_KEY, useValue: publicKey },

        /** Provides the global stripe options */
        { provide: STRIPE_OPTIONS, useValue: options },

        /** Provides StripeJS as an injectable */ 
        { provide: STRIPEJS, useFactory: getStripeJS },

        /** Provides a Stripe instance as an injectable service */
        { provide: STRIPE,
          useFactory: stripeFactory, 
          deps: [ 
            [ new Optional(), new Inject(STRIPE_PUBLIC_KEY) ], 
            [ new Optional(), new Inject(STRIPE_OPTIONS) ] 
          ]}
      ]
    };
  } 
}