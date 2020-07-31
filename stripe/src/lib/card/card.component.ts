import { Component, Inject, forwardRef, Input, ElementRef } from '@angular/core';
import { StripeElement, StripeConfig, StripeConfigToken } from '@wizdm/stripe';
import type { StripeCardElementOptions } from '@stripe/stripe-js';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { StripeElements } from '@wizdm/stripe';

/** Stripe Card Element for Angular */
@Component({
  selector: 'wm-stripe-card',
  template: '',
  providers: [
    { provide: StripeElement, useExisting: forwardRef(() => StripeCard) }
  ]
})
export class StripeCard extends StripeElement<'card'> {

  constructor(elements: StripeElements, @Inject(StripeConfigToken) config: StripeConfig, ref: ElementRef<HTMLElement>) {
    super('card', elements, config, ref);
  }

  /** Card specific options */
  protected get options(): StripeCardElementOptions {
    return { 
     disabled: this.disabled,
     hidePostalCode: this.hidePostalCode,
     hideIcon: this.hideIcon,
     iconStyle: this.iconStyle
    };
  };

  /** The brand of the Card */
  get brand(): string { return !!super.value && super.value.brand || ''; }

  /** Hides the card icon */
  @Input('hideIcon') set hideIconSetter(value: boolean) { this.hideIcon = coerceBooleanProperty(value); }
  public hideIcon: boolean;

  /** Hides the postal code */
  @Input('hidePostalCode') set hidePostalCodeSetter(value: boolean) { this.hidePostalCode = coerceBooleanProperty(value); }
  public hidePostalCode: boolean;

  /** Selects the icon style */
  @Input() iconStyle: StripeCardElementOptions['iconStyle'];
}