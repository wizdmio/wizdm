import { Directive, OnInit, OnChanges, SimpleChanges, Input, Inject, Optional, InjectionToken } from '@angular/core';
import type { StripeElement, StripeElementOptions, SupportedStripeElementType } from './generic-types';
import type { Stripe, StripeElements, StripeElementsOptions } from '@stripe/stripe-js';
import { STRIPE } from '@wizdm/stripe';

/** StripeElementsModule configuration token */
export const STRIPE_ELEMENTS_OPTIONS = new InjectionToken<StripeElementsOptions>('wizdm.stripe.elements.options');

/** Relays the Elements funcitons enabling dynamic locale */
@Directive({
  selector: 'wm-stripe-elements, [StripeElements]',
  exportAs: 'StripeElements'
})
export class StripeElementsDirective implements OnInit, OnChanges {

  public elements: StripeElements;

  constructor(@Inject(STRIPE) readonly stripe: Stripe, @Optional() @Inject(STRIPE_ELEMENTS_OPTIONS) private options: StripeElementsOptions) { }

  // Implements StripeElements functions as generics
  public create<T extends SupportedStripeElementType>(elementType: T, options?: StripeElementOptions<T>): StripeElement<T> {
    return this.elements?.create(elementType as any, options as any) as unknown as StripeElement<T>;
  }

  public getElement<T extends SupportedStripeElementType>(type: T): StripeElement<T> {
    return this.elements?.getElement(type as any) as unknown as StripeElement<T> || null;
  }

  ngOnInit() {

    // Computs the active locale falling back to the global configuratio, if any
    const locale = this.locale || this.options?.locale;
    // Merges the global configurations with the new current locale
    const options = { ...this.options, locale };
    // Initialize the StripeElements object
    this.elements = this.stripe.elements(options as StripeElementsOptions);
  }

  ngOnChanges(changes: SimpleChanges) {
    // Switches to a different locale
    this.elements && this.ngOnInit();
  }

  /** The Elements locale to use. The locale is automatically detected when undefined */
  @Input() locale: string;

  /** Overrides the Elements locale */
  @Input() set StripeElements(locale: string) {
    this.locale = locale;
  }
}