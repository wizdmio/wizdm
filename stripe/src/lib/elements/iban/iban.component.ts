import { StripeElementsDirective, StripeElementDirective, computeBaseStyle } from '@wizdm/stripe/elements';
import { Component, OnInit, OnChanges, Optional, forwardRef, Input, ElementRef } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import type { StripeIbanElementOptions, StripeElementStyleVariant } from '@stripe/stripe-js';

/** Stripe IBAN Element for Angular */
@Component({
  selector: 'wm-stripe-iban',
  template: '',
  providers: [
    { provide: StripeElementDirective, useExisting: forwardRef(() => StripeIban) }
  ]
})
export class StripeIban extends StripeElementDirective<'iban'> implements OnInit, OnChanges {

  constructor(@Optional() elements: StripeElementsDirective, private ref: ElementRef<HTMLElement>) {
    super('iban', elements, ref);

    // Hooks on specific events
    this.forward( elm => {
      
      elm.on('change', value => this.valueChange.emit(this._value = value) );    
      elm.on('escape', () => this.escapeChange.emit() );      
    });
  }

  // Overrides the disabled getter to effectively return the status
  get disabled(): boolean { return !!this.options.disabled; }
 
  // Ovverrides the disable function forwarding the call to the StripeElement 
  public disable(disabled: boolean) {

    this.disabled = disabled;
    this.forward( elm => elm.update(this.options) );
  }

  // Initializes the element
  ngOnInit() { this.init(this.options); }

  // Updates the element on input changes
  ngOnChanges() { this.forward( elm => elm.update(this.options) ); }

  /** Element's custom base style.
   * @see https://stripe.com/docs/js/appendix/style
   * Setting this input value to 'auto' enables the automatic detection of the element's style */
  @Input() set styleBase(value: StripeElementStyleVariant | 'auto') {
    this.style.base = (value === 'auto') ? computeBaseStyle(this.ref.nativeElement) : value;
  }

  /** Element's custom complete style.
   * @see https://stripe.com/docs/js/appendix/style */
  @Input() set styleComplete(value: StripeElementStyleVariant) {
    this.style.complete = value;
  }
  
  /** Element's custom empty style.
   * @see https://stripe.com/docs/js/appendix/style */
  @Input() styleEmpty(value: StripeElementStyleVariant) {
    this.style.empty = value;
  }
  
  /** Element's custom invalid style.
   * @see https://stripe.com/docs/js/appendix/style */
  @Input() styleInvalid(value: StripeElementStyleVariant) {
    this.style.invalid = value;
  }

  /** Supported countries */
  @Input() set supportedCountries(value: string[]) {
    this.options.supportedCountries = value;
  }

  /** Placeholder country */
  @Input() set placeholderCountry(value: string) {
    this.options.placeholderCountry = value;
  }

  /** Hides the card icon */
  @Input() set hideIcon(value: boolean) { 
    this.options.hideIcon = coerceBooleanProperty(value); 
  }

  /** Selects the icon style */
  @Input() set iconStyle(value: StripeIbanElementOptions['iconStyle']) {
    this.options.iconStyle = value;
  }

  /** Disables the element */
  @Input() set disabled(value: boolean) { 
    this.options.disabled = coerceBooleanProperty(value); 
  }
}