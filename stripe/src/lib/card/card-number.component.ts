import { Component, Inject, forwardRef, Input, ElementRef } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CardFieldElementOptions } from '../stripe-definitions/element';
import { StripeConfig, StripeConfigToken } from '../stripe-factory';
import { StripeElements } from '../stripe-elements';
import { StripeElement } from '../stripe-element';

/** Stripe CardNumber Element for Angular */
@Component({
  selector: 'wm-stripe-card-number',
  template: '',
  providers: [
    { provide: StripeElement, useExisting: forwardRef(() => StripeCardNumber) }
  ]
})
export class StripeCardNumber extends StripeElement<'cardNumber'> {

  constructor(elements: StripeElements, @Inject(StripeConfigToken) config: StripeConfig, ref: ElementRef<HTMLElement>) {
    super('cardNumber', elements, config, ref);
  }

  /** CardNumber specific options */
  protected get options(): CardFieldElementOptions {
    return { 
     disabled: this.disabled,
     placeholder: this.placeholder
    };
  };
  
  /** Disables the Card control */
  @Input('disabled') set disableSetter(value: boolean) { this.disabled = coerceBooleanProperty(value); }
  public disabled = false;

  /** A placeholder text */
  @Input() placeholder: string;
}