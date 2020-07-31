import type { Stripe, StripeConstructor, StripeElements, StripeElementsOptions } from '@stripe/stripe-js';
import { Directive, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { StripeConfig, StripeConfigToken } from '../stripe-factory';

@Directive({
  selector: 'wm-stripe-connect, [StripeConnect]',
  exportAs: 'StripeConnect',
  providers: [ 
    { provide: 'Stripe', useExisting: forwardRef(() => StripeConnect) }
  ]
})
export class StripeConnect implements OnInit /*, Stripe*/ {

  public stripe: Stripe;

  constructor(@Inject('StripeJS') private stripejs: StripeConstructor, @Inject(StripeConfigToken) private config: StripeConfig) { }

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
  public elements(options?: StripeElementsOptions): StripeElements {

    return this.stripe?.elements(options);
  }
}