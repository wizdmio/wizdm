import { Component, Inject, forwardRef, Input, ElementRef } from '@angular/core';
import { StripeElement, StripeConfig, StripeConfigToken } from '@wizdm/stripe';
import type { StripeCardNumberElementOptions } from '@stripe/stripe-js';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { StripeElements } from '@wizdm/stripe';

/** Stripe CardNumber Element for Angular */
@Component({
  selector: 'wm-stripe-card-number',
  template: '',
  providers: [
    { provide: StripeElement, useExisting: forwardRef(() => StripeCardNumber) }
  ]
})
export class StripeCardNumber extends StripeElement<'cardNumber'> {

  constructor(elements: StripeElements, @Inject(StripeConfigToken) config: StripeConfig, ref: ElementRef<HTMLElement>) {
    super('cardNumber', elements, config, ref);
  }

  /** CardNumber specific options */
  protected get options(): StripeCardNumberElementOptions {
    return { 
     disabled: this.disabled,
     placeholder: this.placeholder
    };
  };
  
  /** A placeholder text */
  @Input() placeholder: string;
}