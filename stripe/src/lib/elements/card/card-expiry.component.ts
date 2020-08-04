import { StripeElementsDirective, StripeElementDirective } from '@wizdm/stripe/elements';
import { Component, Optional, forwardRef, Input, ElementRef } from '@angular/core';
import type { StripeCardExpiryElementOptions } from '@stripe/stripe-js';

/** Stripe Card Exipation Date Element for Angular */
@Component({
  selector: 'wm-stripe-card-expiry',
  template: '',
  providers: [
    { provide: StripeElementDirective, useExisting: forwardRef(() => StripeCardExpiry) }
  ]
})
export class StripeCardExpiry extends StripeElementDirective<'cardExpiry'> {

  constructor(@Optional() elements: StripeElementsDirective, ref: ElementRef<HTMLElement>) {
    super('cardExpiry', elements, ref);
  }

  /** CardExpiry specific options */
  protected get options(): StripeCardExpiryElementOptions {
    return { 
     placeholder: this.placeholder
    };
  };
  
  /** A placeholder text */
  @Input() placeholder: string;
}