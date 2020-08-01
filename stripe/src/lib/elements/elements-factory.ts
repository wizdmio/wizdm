import type { Stripe, StripeElementsOptions, StripeElementClasses, StripeElementStyle } from '@stripe/stripe-js';
import { InjectionToken } from '@angular/core';

export interface StripeElementsConfig {
  elementsOptions?: StripeElementsOptions; 
  classes?: StripeElementClasses;
  style?: StripeElementStyle;
}

/** StripeElementsModule configuration token */
export const STRIPE_ELEMENTS_CONFIG = new InjectionToken<StripeElementsConfig>('wizdm.stripe.elements.config');

/** Instantiates a StripeElements instance */
export function stripeElementsFactory(stripe: Stripe, config: StripeElementsConfig) {
  
  return stripe && stripe.elements(config.elementsOptions);
}