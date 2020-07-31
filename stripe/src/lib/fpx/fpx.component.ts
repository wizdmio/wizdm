import { Component, Inject, forwardRef, Input, ElementRef } from '@angular/core';
import { StripeElement, StripeConfig, StripeConfigToken } from '@wizdm/stripe';
import type { StripeFpxBankElementOptions } from '@stripe/stripe-js';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { StripeElements } from '@wizdm/stripe';

/** Stripe fpxBank Element 
 * @see https://stripe.com/docs/payments/fpx
 */
@Component({
  selector: 'wm-stripe-fpx-bank',
  template: '',
  providers: [
    { provide: StripeElement, useExisting: forwardRef(() => StripeFpxBank) }
  ]
})
export class StripeFpxBank extends StripeElement<'fpxBank'> {

  constructor(elements: StripeElements, @Inject(StripeConfigToken) config: StripeConfig, ref: ElementRef<HTMLElement>) {
    super('fpxBank', elements, config, ref);
  }

  protected get options(): StripeFpxBankElementOptions {
    return { 
      accountHolderType: this.accountHolderType,
      disabled: this.disabled,     
      value: this.fpxValue
    };
  }

  /** Account Holder Type */
  @Input() accountHolderType: StripeFpxBankElementOptions['accountHolderType'];
  
  /**
   * A pre-filled value for the Element. Can be one of the banks listed in the
   * @see https://stripe.com/docs/payments/fpx/accept-a-payment#bank-reference
   * @example 'affin_bank'
   */
  @Input('value') fpxValue: string;
}