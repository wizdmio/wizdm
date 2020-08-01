import { StripeElements, StripeElement, StripeElementsConfig, STRIPE_ELEMENTS_CONFIG } from '@wizdm/stripe/elements';
import { Component, Inject, forwardRef, Input, ElementRef } from '@angular/core';
import type { StripeCardExpiryElementOptions } from '@stripe/stripe-js';

/** Stripe Card Exipation Date Element for Angular */
@Component({
  selector: 'wm-stripe-card-expiry',
  template: '',
  providers: [
    { provide: StripeElement, useExisting: forwardRef(() => StripeCardExpiry) }
  ]
})
export class StripeCardExpiry extends StripeElement<'cardExpiry'> {

  constructor(elements: StripeElements, @Inject(STRIPE_ELEMENTS_CONFIG) config: StripeElementsConfig, ref: ElementRef<HTMLElement>) {
    super('cardExpiry', elements, config, ref);
  }

  protected get options(): StripeCardExpiryElementOptions {
    return { 
     disabled: this.disabled,
     placeholder: this.placeholder
    };
  };
  
  /** A placeholder text */
  @Input() placeholder: string;
}