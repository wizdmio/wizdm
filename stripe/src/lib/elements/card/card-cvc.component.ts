import { StripeElementsDirective, StripeElementDirective } from '@wizdm/stripe/elements';
import { Component, Optional, forwardRef, Input, ElementRef } from '@angular/core';
import type { StripeCardCvcElementOptions } from '@stripe/stripe-js';

/** Stripe Card CVC Element for Angular */
@Component({
  selector: 'wm-stripe-card-cvc',
  template: '',
  providers: [
    { provide: StripeElementDirective, useExisting: forwardRef(() => StripeCardCvc) }
  ]
})
export class StripeCardCvc extends StripeElementDirective<'cardCvc'> {

  constructor(@Optional() elements: StripeElementsDirective, ref: ElementRef<HTMLElement>) {
    super('cardCvc', elements, ref);
  }

  /** CardCvc specific options */
  protected get options(): StripeCardCvcElementOptions {
    return { 
     placeholder: this.placeholder
    };
  };
  
  /** A placeholder text */
  @Input() placeholder: string;
}