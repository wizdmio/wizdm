import { Component, Inject, forwardRef, Input, ElementRef } from '@angular/core';
import { StripeElement, StripeConfig, StripeConfigToken } from '@wizdm/stripe';
import type { StripeCardExpiryElementOptions } from '@stripe/stripe-js';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { StripeElements } from '@wizdm/stripe';

/** Stripe Card Exipation Date Element for Angular */
@Component({
  selector: 'wm-stripe-card-expiry',
  template: '',
  providers: [
    { provide: StripeElement, useExisting: forwardRef(() => StripeCardExpiry) }
  ]
})
export class StripeCardExpiry extends StripeElement<'cardExpiry'> {

  constructor(elements: StripeElements, @Inject(StripeConfigToken) config: StripeConfig, ref: ElementRef<HTMLElement>) {
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