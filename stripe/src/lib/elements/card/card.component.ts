import { StripeElementsDirective, StripeElementDirective, StripeElementsConfig, STRIPE_ELEMENTS_CONFIG } from '@wizdm/stripe/elements';
import { Component, Inject, Optional, forwardRef, Input, ElementRef } from '@angular/core';
import type { StripeCardElementOptions } from '@stripe/stripe-js';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

/** Stripe Card Element for Angular */
@Component({
  selector: 'wm-stripe-card',
  template: '',
  providers: [
    { provide: StripeElementDirective, useExisting: forwardRef(() => StripeCard) }
  ]
})
export class StripeCard extends StripeElementDirective<'card'> {

  constructor(@Optional() elements: StripeElementsDirective, @Optional() @Inject(STRIPE_ELEMENTS_CONFIG) config: StripeElementsConfig, ref: ElementRef<HTMLElement>) {
    super('card', elements, config, ref);
  }

  /** Card specific options */
  protected get options(): StripeCardElementOptions {
    return { 
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