import { Component, Inject, forwardRef, Input, ElementRef } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { IdealElementOptions, IconStyle } from '../stripe-definitions/element';
import { StripeConfig, StripeConfigToken } from '../stripe-factory';
import { StripeElements } from '../stripe-elements';
import { StripeElement } from '../stripe-element';

@Component({
  selector: 'wm-stripe-ieal',
  template: '',
  providers: [
    { provide: StripeElement, useExisting: forwardRef(() => StripeIdeal) }
  ]
})
export class StripeIdeal extends StripeElement<'ideal'> {

  constructor(elements: StripeElements, @Inject(StripeConfigToken) config: StripeConfig, ref: ElementRef<HTMLElement>) {
    super('ideal', elements, config, ref);
  }

  protected get options(): IdealElementOptions {
    return { 
     disabled: this.disabled,
     hideIcon: this.hideIcon,
     value: this.idealValue
    };
  }
  
  /** Disables the Card control */
  @Input('disabled') set disableSetter(value: boolean) { this.disabled = coerceBooleanProperty(value); }
  public disabled = false;

  /** Hides the card icon */
  @Input('hideIcon') set hideIconSetter(value: boolean) { this.hideIcon = coerceBooleanProperty(value); }
  public hideIcon: boolean;

  /**
   * A pre-filled value for the Element. Can be one of the banks listed in the
   * @see https://stripe.com/docs/sources/ideal#optional-specifying-the-customers-bank
   * @example 'abn_amro'
   */
  @Input('value') idealValue: string;
}