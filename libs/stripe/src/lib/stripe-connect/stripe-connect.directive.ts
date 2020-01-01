import { Directive, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { Elements, ElementsOptions, Element, ElementType, ElementOptions } from '../stripe-definitions/element';
import { StripeConfig, StripeConfigToken } from '../stripe-factory';
import { StripeJS, Stripe } from '../stripe-definitions';

@Directive({
  selector: 'wm-stripe-connect, [StripeConnect]',
  exportAs: 'StripeConnect',
  providers: [ 
    { provide: Stripe, useExisting: forwardRef(() => StripeConnect) }
  ]
})
export class StripeConnect implements OnInit /*, Stripe*/ {

  public stripe: Stripe;

  constructor(@Inject('StripeJS') private stripejs: StripeJS, @Inject(StripeConfigToken) private config: StripeConfig) { }

  ngOnInit() {

    console.log("Providing Stripe connected to:", this.account);

    // Gets a new stripe instance connected to the specified account
    this.stripe = this.stripejs(this.config.publicKey, { 
      // Merges the global configuration with the specified account
      ...this.config.options, 
      // Stripe Account to connect to
      stripeAccount: this.account
    });
  }

  @Input() account: string;

  /**
   * Implements Elements for children to use
   */
  public elements(options?: ElementsOptions): Elements {

    return this.stripe && this.stripe.elements(options);
  }
}