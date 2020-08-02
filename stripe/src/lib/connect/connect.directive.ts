import { Directive, OnDestroy, Input, Inject, Optional, forwardRef, TemplateRef, ViewContainerRef, EmbeddedViewRef } from '@angular/core';
import type { Stripe, StripeConstructor, StripeConstructorOptions, StripeElements, StripeElementsOptions } from '@stripe/stripe-js';
import { STRIPE_PUBLIC_KEY, STRIPE_OPTIONS, STRIPEJS, STRIPE } from '../stripe-factory';

/** Use *Stripe="let stripe connect accountNumber" to connect your stripe instance to the given account*/
@Directive({
  selector: 'ng-template[Stripe]',
  exportAs: 'StripeConnectDirective',
  providers: [ 
    { provide: STRIPE, useExisting: forwardRef(() => StripeConnectDirective) }
  ]
})
export class StripeConnectDirective implements OnDestroy, Partial<Stripe> {

  private embeddedView: EmbeddedViewRef<StripeConnectDirective>;
  public $implicit: Stripe;

  constructor(private tpl: TemplateRef<StripeConnectDirective>, private vcr: ViewContainerRef,
              @Inject(STRIPEJS) private stripejs: StripeConstructor, 
              @Inject(STRIPE_PUBLIC_KEY) private publicKey: string, 
              @Optional() @Inject(STRIPE_OPTIONS) private options: StripeConstructorOptions) { }

  /** Implements Elements constructor for children to use */
  public elements(options?: StripeElementsOptions): StripeElements {
    return this.$implicit?.elements(options);
  }  

  /** Connects Stripe to the given account number */
  @Input() set StripeConnectDirective(stripeAccount: string) {
    
    // Clear the previews views, if any
    if(this.embeddedView) { this.vcr.clear(); }

    // Gets rid of the previous stripe instance
    if(this.$implicit) { delete this.$implicit; }

    console.log('Connecting stripe to account', stripeAccount);

    // Gets a new stripe instance connected to the specified account
    this.$implicit = this.stripejs(this.publicKey, { 
      // Merges the global configuration with the specified account
      ...this.options, 
      // Stripe Account to connect to
      stripeAccount
    });

    // Creates the view containing the StripeElements that will connect to this Stripe instance
    this.embeddedView = this.vcr.createEmbeddedView(this.tpl, this);
  }

  // Clear all views on destroy
  ngOnDestroy() { this.vcr.clear(); }
}