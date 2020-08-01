import type { StripeElement, StripeElementOptions, SupportedStripeElementType } from './generic-types';
import type { Stripe, StripeElements as Elements, StripeElementsOptions } from '@stripe/stripe-js';
import { Directive, OnInit, OnChanges, SimpleChanges, Input, Inject } from '@angular/core';
import { StripeElementsConfig, STRIPE_ELEMENTS_CONFIG } from './elements-factory';

/** Relays the Elements funcitons enabling dynamic locale */
@Directive({
  selector: 'wm-stripe-elements, [StripeElements]',
  exportAs: 'StripeElements'
})
export class StripeElements implements OnInit, OnChanges {

  public elements: Elements;

  @Input() locale: string;

  @Input() set StripeElements(locale: string) {
    this.locale = locale;
  }

  constructor(@Inject('Stripe') readonly stripe: Stripe, @Inject(STRIPE_ELEMENTS_CONFIG) private config: StripeElementsConfig) { }

  // Implements StripeElements functions as generics
  public create<T extends SupportedStripeElementType>(elementType: T, options?: StripeElementOptions<T>): StripeElement<T> {
    return this.elements?.create(elementType as any, options as any) as unknown as StripeElement<T>;
  }

  public getElement<T extends SupportedStripeElementType>(type: T): StripeElement<T> {
    return this.elements?.getElement(type as any) as unknown  as StripeElement<T> || null;
  }

  ngOnInit() {
    // Merges the global configurations with the new current locale
    const options = { ...this.config.elementsOptions, locale: this.locale };
    // Initialize the StripeElements object
    this.elements = this.stripe.elements(options as StripeElementsOptions);
  }

  ngOnChanges(changes: SimpleChanges) {
    // Switches to a different locale
    this.elements && this.ngOnInit();
  }
}