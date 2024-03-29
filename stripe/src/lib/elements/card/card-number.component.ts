import { StripeElementsDirective, StripeElementDirective, StripeControlDirective, computeBaseStyle } from '@wizdm/stripe/elements';
import { Directive, Component, OnInit, OnChanges, Optional, forwardRef, Input, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import type { StripeElementStyleVariant } from '@stripe/stripe-js';

/** Bridge with the Angular's form API */
@Directive({
  selector: 'wm-stripe-card-number[ngModel], wm-stripe-card-number[formControl], wm-stripe-card-number[formControlName]',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => StripeCardNumberControl), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => StripeCardNumberControl), multi: true  }
  ]
})
export class StripeCardNumberControl extends StripeControlDirective<'cardNumber'> {}

/** Stripe CardNumber Element for Angular */
@Component({
  selector: 'wm-stripe-card-number',
  template: '',
  providers: [
    { provide: StripeElementDirective, useExisting: forwardRef(() => StripeCardNumber) }
  ]
})
export class StripeCardNumber extends StripeElementDirective<'cardNumber'> implements OnInit, OnChanges {

  constructor(@Optional() elements: StripeElementsDirective, private ref: ElementRef<HTMLElement>) {
    super('cardNumber', elements, ref);

    // Hooks on CardElement specific events
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

  /** A placeholder text */
  @Input() set placeholder(value: string) {
    this.options.placeholder = value;
  }

  /** Disables the element */
  @Input() set disabled(value: boolean) { 
    this.options.disabled = coerceBooleanProperty(value); 
  }
  
   /** Show a card brand icon in the Element */
  @Input() set showIcon(value: boolean) { 
    this.options.showIcon = coerceBooleanProperty(value); 
  }
}