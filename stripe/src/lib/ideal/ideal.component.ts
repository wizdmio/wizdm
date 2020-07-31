import { Component, Inject, forwardRef, Input, ElementRef } from '@angular/core';
import { StripeElement, StripeConfig, StripeConfigToken } from '@wizdm/stripe';
import type { StripeIdealBankElementOptions } from '@stripe/stripe-js';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { StripeElements } from '@wizdm/stripe';

@Component({
  selector: 'wm-stripe-ideal-bank',
  template: '',
  providers: [
    { provide: StripeElement, useExisting: forwardRef(() => StripeIdealBank) }
  ]
})
export class StripeIdealBank extends StripeElement<'idealBank'> {

  constructor(elements: StripeElements, @Inject(StripeConfigToken) config: StripeConfig, ref: ElementRef<HTMLElement>) {
    super('idealBank', elements, config, ref);
  }

  protected get options(): StripeIdealBankElementOptions {
    return { 
     disabled: this.disabled,
     hideIcon: this.hideIcon,
     value: this.idealValue
    };
  }
  
  /** Hides the icon */
  @Input('hideIcon') set hideIconSetter(value: boolean) { this.hideIcon = coerceBooleanProperty(value); }
  public hideIcon: boolean;

  /**
   * A pre-filled value for the Element. Can be one of the banks listed in the
   * @see https://stripe.com/docs/sources/ideal#optional-specifying-the-customers-bank
   * @example 'abn_amro'
   */
  @Input('value') idealValue: string;
}