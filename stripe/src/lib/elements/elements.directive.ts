import { Directive, OnInit, OnChanges, SimpleChanges, Input, Inject, Optional, InjectionToken, inject, forwardRef } from '@angular/core';
import type { Stripe, StripeElements, StripeElementsOptions, StripeElementClasses, StripeElementStyle } from '@stripe/stripe-js';
import type { StripeElement, StripeElementOptions, SupportedStripeElementType } from './generic-types';
import { STRIPE } from '@wizdm/stripe';

export interface StripeElementsConfig {
  elementsOptions?: StripeElementsOptions; 
  classes?: StripeElementClasses;
  style?: StripeElementStyle;
}

/** StripeElementsModule configuration token */
export const STRIPE_ELEMENTS_CONFIG = new InjectionToken<StripeElementsConfig>('wizdm.stripe.elements.config');

/** Relays the Elements funcitons enabling dynamic locale */
@Directive({
  selector: 'wm-stripe-elements, [StripeElements]',
  exportAs: 'StripeElements'
})
export class StripeElementsDirective implements OnInit, OnChanges {

  public elements: StripeElements;

  @Input() locale: string;

  @Input() set StripeElements(locale: string) {
    this.locale = locale;
  }

  constructor(@Inject(STRIPE) readonly stripe: Stripe, @Optional() @Inject(STRIPE_ELEMENTS_CONFIG) private config: StripeElementsConfig) { }

  // Implements StripeElements functions as generics
  public create<T extends SupportedStripeElementType>(elementType: T, options?: StripeElementOptions<T>): StripeElement<T> {
    return this.elements?.create(elementType as any, options as any) as unknown as StripeElement<T>;
  }

  public getElement<T extends SupportedStripeElementType>(type: T): StripeElement<T> {
    return this.elements?.getElement(type as any) as unknown as StripeElement<T> || null;
  }

  ngOnInit() {

    // Computs the active locale falling back to the global configuratio, if any
    const locale = this.locale || this.config?.elementsOptions?.locale;
    // Merges the global configurations with the new current locale
    const options = { ...this.config?.elementsOptions, locale };
    // Initialize the StripeElements object
    this.elements = this.stripe.elements(options as StripeElementsOptions);
  }

  ngOnChanges(changes: SimpleChanges) {
    // Switches to a different locale
    this.elements && this.ngOnInit();
  }
}