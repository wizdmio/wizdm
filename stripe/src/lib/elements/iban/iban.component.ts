import { StripeElements, StripeElement, StripeElementsConfig, STRIPE_ELEMENTS_CONFIG } from '@wizdm/stripe/elements';
import { Component, Inject, forwardRef, Input, ElementRef } from '@angular/core';
import type { StripeIbanElementOptions } from '@stripe/stripe-js';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

/** Stripe IBAN Element for Angular */
@Component({
  selector: 'wm-stripe-iban',
  template: '',
  providers: [
    { provide: StripeElement, useExisting: forwardRef(() => StripeIban) }
  ]
})
export class StripeIban extends StripeElement<'iban'> {

  constructor(elements: StripeElements, @Inject(STRIPE_ELEMENTS_CONFIG) config: StripeElementsConfig, ref: ElementRef<HTMLElement>) {
    super('iban', elements, config, ref);
  }

  /** IBAN specific options */
  protected get options(): StripeIbanElementOptions {
    return { 
     disabled: this.disabled,
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