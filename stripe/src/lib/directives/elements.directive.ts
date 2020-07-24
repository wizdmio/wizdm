import { Directive, OnInit, OnChanges, SimpleChanges, Input, Inject } from '@angular/core';
import { Elements, Element, ElementType, ElementOptions } from '../definitions/element';
import { StripeConfig, StripeConfigToken } from '../stripe-factory';
import { Stripe } from '../definitions/stripe';

/** Relays the Elements funcitons enabling dynamic locale */
@Directive({
  selector: 'wm-stripe-elements, [StripeElements]',
  exportAs: 'StripeElements'
})
export class StripeElements implements OnInit, OnChanges, Elements {

  public elements: Elements;

  @Input() locale: string;

  @Input() set StripeElements(locale: string) {
    this.locale = locale;
  }

  constructor(readonly stripe: Stripe, @Inject(StripeConfigToken) private config: StripeConfig) { }

  // Implements Elements functions
  public create<T extends ElementType>(elementType: T, options?: ElementOptions<T>): Element<T> {
    return this.elements && this.elements.create(elementType, options);
  }  

  public getElement<T extends ElementType>(type: T): Element<T> {
    return this.elements.getElement(type);
  }

  ngOnInit() {
    // Merges the global configurations with the new current locale
    const options = { ...this.config.elementsOptions, locale: this.locale };
    // Initialize the StripeElements object
    this.elements = this.stripe.elements(options);
  }

  ngOnChanges(changes: SimpleChanges) {
    // Switches to a different locale
    this.elements && this.ngOnInit();
  }
}