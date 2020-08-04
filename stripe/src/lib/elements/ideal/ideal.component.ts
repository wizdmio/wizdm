import { StripeElementsDirective, StripeElementDirective } from '@wizdm/stripe/elements';
import { Component, Optional, forwardRef, Input, ElementRef } from '@angular/core';
import type { StripeIdealBankElementOptions } from '@stripe/stripe-js';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'wm-stripe-ideal-bank',
  template: '',
  providers: [
    { provide: StripeElementDirective, useExisting: forwardRef(() => StripeIdealBank) }
  ]
})
export class StripeIdealBank extends StripeElementDirective<'idealBank'> {

  constructor(@Optional() elements: StripeElementsDirective, ref: ElementRef<HTMLElement>) {
    super('idealBank', elements, ref);
  }

  protected get options(): StripeIdealBankElementOptions {
    return { 
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