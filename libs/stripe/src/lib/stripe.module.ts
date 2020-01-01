import { APP_INITIALIZER, PLATFORM_ID, NgModule, ModuleWithProviders, Inject, Optional, forwardRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { StripeConfig, StripeConfigToken, loadStripeJS, getStripeJS, stripeFactory  } from './stripe-factory';
import { StripeControl } from './stripe-control';
import { StripeConnect } from './stripe-connect';
import { StripeMaterial } from './stripe-material';
import { StripeElements } from './stripe-elements';
import { StripeCard } from './stripe-card';
import { StripeCardNumber } from './stripe-card-number';
import { StripeCardExpiry} from './stripe-card-expiry';
import { StripeCardCvc } from './stripe-card-cvc';
import { StripeIban } from './stripe-iban';
import { StripeIdeal } from './stripe-ideal';
import { Stripe } from './stripe-definitions';

export const STRIPE_EXPORTS = [
  StripeControl, StripeConnect, StripeMaterial, StripeElements, 
  StripeCard, StripeCardNumber, StripeCardExpiry, StripeCardCvc, 
  StripeIban, StripeIdeal
];

@NgModule({
  imports: [ /*CommonModule*/ ],
  declarations: STRIPE_EXPORTS,
  exports: STRIPE_EXPORTS
})
export class StripeModule {

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    if( !isPlatformBrowser(platformId) ) {
      throw new Error('StripeModule package supports Browsers only');
    }
  }

  static init(config: StripeConfig): ModuleWithProviders<StripeModule> {
    return {
      ngModule: StripeModule,
      providers: [
        
        { provide: APP_INITIALIZER, useValue: loadStripeJS, multi: true },
        
        { provide: StripeConfigToken, useValue: config },

        { 
          provide: Stripe,
          useFactory: stripeFactory, 
          deps: [ [ new Optional(), new Inject(StripeConfigToken) ] ]
        },
        
        {
          provide: StripeElements,
          useFactory: (stripe: Stripe, config: StripeConfig) => stripe.elements(config.elementsOptions),
          deps: [ forwardRef(() => Stripe), [  new Optional(), new Inject(StripeConfigToken) ] ]
        }
      ]
    };
  } 
}