import { StripeElementsDirective, StripeElementDirective } from '@wizdm/stripe/elements';
import { Component, Optional, forwardRef, Input, ElementRef } from '@angular/core';
import type { StripeIbanElementOptions } from '@stripe/stripe-js';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

/** Stripe IBAN Element for Angular */
@Component({
  selector: 'wm-stripe-iban',
  template: '',
  providers: [
    { provide: StripeElementDirective, useExisting: forwardRef(() => StripeIban) }
  ]
})
export class StripeIban extends StripeElementDirective<'iban'> {

  constructor(@Optional() elements: StripeElementsDirective, ref: ElementRef<HTMLElement>) {
    super('iban', elements, ref);
  }

  /** IBAN specific options */
  protected get options(): StripeIbanElementOptions {
    return { 
     hideIcon: this.hideIcon,
     iconStyle: this.iconStyle,
     supportedCountries: this.supportedCountries || ['SEPA']
    };
  }
  
  /** Hides the card icon */
  @Input('hideIcon') set hideIconSetter(value: boolean) { this.hideIcon = coerceBooleanProperty(value); }
  public hideIcon: boolean;

  /** Selects the icon style */
  @Input() iconStyle: StripeIbanElementOptions['iconStyle'];

  /** Supported countries */
  @Input() supportedCountries: string[]
}