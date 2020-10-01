import { StripeElementsDirective, StripeElementDirective, computeBaseStyle } from '@wizdm/stripe/elements';
import { Component, OnInit, OnChanges, Optional, forwardRef, Input, ElementRef } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import type { StripeIdealBankElementOptions, StripeElementStyleVariant } from '@stripe/stripe-js';

@Component({
  selector: 'wm-stripe-ideal-bank',
  template: '',
  providers: [
    { provide: StripeElementDirective, useExisting: forwardRef(() => StripeIdealBank) }
  ]
})
export class StripeIdealBank extends StripeElementDirective<'idealBank'> implements OnInit, OnChanges {

  constructor(@Optional() elements: StripeElementsDirective, private ref: ElementRef<HTMLElement>) {
    super('idealBank', elements, ref);

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

  /**
   * A pre-filled value for the Element. Can be one of the banks listed in the
   * @see https://stripe.com/docs/sources/ideal#optional-specifying-the-customers-bank
   * @example 'abn_amro'
   */
  @Input('value') set idealValue(value: string) {
    this.options.value = value;
  }

  /** Selects the icon style */
  @Input() set iconStyle(value: StripeIdealBankElementOptions['iconStyle']) {
    this.options.iconStyle = value;
  }

  /** Hides the card icon */
  @Input() set hideIcon(value: boolean) { 
    this.options.hideIcon = coerceBooleanProperty(value); 
  }

  /** Disables the element */
  @Input() set disabled(value: boolean) { 
    this.options.disabled = coerceBooleanProperty(value); 
  }
}