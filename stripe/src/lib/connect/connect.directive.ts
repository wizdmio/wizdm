import type { Stripe, StripeConstructor, StripeConstructorOptions, StripeElements, StripeElementsOptions } from '@stripe/stripe-js';
import { Directive, OnInit, Input, Inject, Optional, forwardRef } from '@angular/core';
import { STRIPE_PUBLIC_KEY, STRIPE_OPTIONS, STRIPEJS, STRIPE } from '../stripe-factory';

@Directive({
  selector: 'wm-stripe-connect, [StripeConnect]',
  exportAs: 'StripeConnect',
  providers: [ 
    { provide: STRIPE, useExisting: forwardRef(() => StripeConnect) }
  ]
})
export class StripeConnect implements OnInit /*, Stripe*/ {

  public stripe: Stripe;

  constructor(@Inject(STRIPEJS) private stripejs: StripeConstructor, 
              @Inject(STRIPE_PUBLIC_KEY) private publicKey: string, 
              @Optional() @Inject(STRIPE_OPTIONS) private options: StripeConstructorOptions) { }

  ngOnInit() {

    console.log("Providing Stripe connected to:", this.account);

    // Gets a new stripe instance connected to the specified account
    this.stripe = this.stripejs(this.publicKey, { 
      // Merges the global configuration with the specified account
      ...this.options, 
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