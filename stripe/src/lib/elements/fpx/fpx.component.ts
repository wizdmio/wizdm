import { StripeElements, StripeElement, StripeElementsConfig, STRIPE_ELEMENTS_CONFIG } from '@wizdm/stripe/elements';
import { Component, Inject, forwardRef, Input, ElementRef } from '@angular/core';
import type { StripeFpxBankElementOptions } from '@stripe/stripe-js';

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

  constructor(elements: StripeElements, @Inject(STRIPE_ELEMENTS_CONFIG) config: StripeElementsConfig, ref: ElementRef<HTMLElement>) {
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