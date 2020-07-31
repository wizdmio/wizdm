import { Component, Inject, forwardRef, Input, ElementRef } from '@angular/core';
import { StripeElement, StripeConfig, StripeConfigToken } from '@wizdm/stripe';
import type { StripeCardCvcElementOptions } from '@stripe/stripe-js';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { StripeElements } from '@wizdm/stripe';

/** Stripe Card CVC Element for Angular */
@Component({
  selector: 'wm-stripe-card-cvc',
  template: '',
  providers: [
    { provide: StripeElement, useExisting: forwardRef(() => StripeCardCvc) }
  ]
})
export class StripeCardCvc extends StripeElement<'cardCvc'> {

  constructor(elements: StripeElements, @Inject(StripeConfigToken) config: StripeConfig, ref: ElementRef<HTMLElement>) {
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