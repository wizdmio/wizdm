import { StripeElementsDirective, StripeElementDirective } from '@wizdm/stripe/elements';
import { Component, Optional, forwardRef, Input, ElementRef } from '@angular/core';
import type { StripeCardNumberElementOptions } from '@stripe/stripe-js';

/** Stripe CardNumber Element for Angular */
@Component({
  selector: 'wm-stripe-card-number',
  template: '',
  providers: [
    { provide: StripeElementDirective, useExisting: forwardRef(() => StripeCardNumber) }
  ]
})
export class StripeCardNumber extends StripeElementDirective<'cardNumber'> {

  constructor(@Optional() elements: StripeElementsDirective, ref: ElementRef<HTMLElement>) {
    super('cardNumber', elements, ref);
  }

  /** CardNumber specific options */
  protected get options(): StripeCardNumberElementOptions {
    return { 
     placeholder: this.placeholder
    };
  };
  
  /** A placeholder text */
  @Input() placeholder: string;
}