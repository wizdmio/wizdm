import { StripeElementsDirective, StripeElementDirective, STRIPE_ELEMENTS_OPTIONS } from '@wizdm/stripe/elements';
import { Component, Inject, Optional, forwardRef, Input, ElementRef } from '@angular/core';
import type { StripeElementsOptions, StripeCardExpiryElementOptions } from '@stripe/stripe-js';

/** Stripe Card Exipation Date Element for Angular */
@Component({
  selector: 'wm-stripe-card-expiry',
  template: '',
  providers: [
    { provide: StripeElementDirective, useExisting: forwardRef(() => StripeCardExpiry) }
  ]
})
export class StripeCardExpiry extends StripeElementDirective<'cardExpiry'> {

  constructor(@Optional() elements: StripeElementsDirective, @Optional() @Inject(STRIPE_ELEMENTS_OPTIONS) config: StripeElementsOptions, ref: ElementRef<HTMLElement>) {
    super('cardExpiry', elements, config, ref);
  }

  protected get options(): StripeCardExpiryElementOptions {
    return { 
     placeholder: this.placeholder
    };
  };
  
  /** A placeholder text */
  @Input() placeholder: string;
}