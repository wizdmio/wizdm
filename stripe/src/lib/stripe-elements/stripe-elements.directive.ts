import { Directive, OnInit, OnChanges, SimpleChanges, Input, Inject } from '@angular/core';
import { Elements, Element, ElementType, ElementOptions } from '../stripe-definitions/element';
import { StripeConfig, StripeConfigToken } from '../stripe-factory';
import { Stripe } from '../stripe-definitions';

@Directive({
  selector: 'wm-stripe-elements, [StripeElements]',
  exportAs: 'StripeElements'
})
export class StripeElements implements OnInit, OnChanges, Elements {

  public elements: Elements;

  constructor(readonly stripe: Stripe, @Inject(StripeConfigToken) private config: StripeConfig) { }

  // Implements Elements functions

  public create<T extends ElementType>(elementType: T, options?: ElementOptions<T>): Element<T> {
    return this.elements && this.elements.create(elementType, options);
  }  

  public getElement<T extends ElementType>(type: T): Element<T> {
    return this.elements.getElement(type);
  }

  ngOnInit() {

    const options = { ...this.config.elementsOptions, locale: this.locale };

    this.elements = this.stripe.elements(options);
  }

  ngOnChanges(changes: SimpleChanges) {

    this.elements && this.ngOnInit();
  }

  @Input() locale: string;
}