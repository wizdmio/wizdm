import { StripeElements, StripeElement, StripeElementsConfig, STRIPE_ELEMENTS_CONFIG } from '@wizdm/stripe/elements';
import { Component, Inject, forwardRef, Input, ElementRef } from '@angular/core';
import type { StripeCardCvcElementOptions } from '@stripe/stripe-js';

/** Stripe Card CVC Element for Angular */
@Component({
  selector: 'wm-stripe-card-cvc',
  template: '',
  providers: [
    { provide: StripeElement, useExisting: forwardRef(() => StripeCardCvc) }
  ]
})
export class StripeCardCvc extends StripeElement<'cardCvc'> {

  constructor(elements: StripeElements, @Inject(STRIPE_ELEMENTS_CONFIG) config: StripeElementsConfig, ref: ElementRef<HTMLElement>) {
    super('cardCvc', elements, config, ref);
  }

  protected get options(): StripeCardCvcElementOptions {
    return { 
     disabled: this.disabled,
     placeholder: this.placeholder
    };
  };
  
  /** A placeholder text */
  @Input() placeholder: string;
}