import { Component, Inject, forwardRef, Input, ElementRef } from '@angular/core';
import { IbanElementOptions, IconStyle } from '../definitions/element';
import { StripeConfig, StripeConfigToken } from '../stripe-factory';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { StripeElement } from '../stripe-element';
import { StripeElements } from '../directives';

/** Stripe IBAN Element for Angular */
@Component({
  selector: 'wm-stripe-iban',
  template: '',
  providers: [
    { provide: StripeElement, useExisting: forwardRef(() => StripeIban) }
  ]
})
export class StripeIban extends StripeElement<'iban'> {

  constructor(elements: StripeElements, @Inject(StripeConfigToken) config: StripeConfig, ref: ElementRef<HTMLElement>) {
    super('iban', elements, config, ref);
  }

  /** IBAN specific options */
  protected get options(): IbanElementOptions {
    return { 
     disabled: this.disabled,
     hideIcon: this.hideIcon,
     iconStyle: this.iconStyle,
     supportedCountries: this.supportedCountries || ['SEPA']
    };
  }
  
  /** Disables the Card control */
  @Input('disabled') set disableSetter(value: boolean) { this.disabled = coerceBooleanProperty(value); }
  public disabled = false;

  /** Hides the card icon */
  @Input('hideIcon') set hideIconSetter(value: boolean) { this.hideIcon = coerceBooleanProperty(value); }
  public hideIcon: boolean;

  /** Selects the icon style */
  @Input() iconStyle: IconStyle;

  /** Supported countries */
  @Input() supportedCountries: string[]
}