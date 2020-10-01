import type { Stripe, StripeConstructor, StripeConstructorOptions } from '@stripe/stripe-js';
import { Observable, BehaviorSubject, from, throwError } from 'rxjs';
import { map, take, switchMap, shareReplay } from 'rxjs/operators';

/** StripeCaller class implements an observable-based proxy to call the Stripe.js SDK */
export class StripeCaller {

  /** The optional stripe account to connect to @see [Connect](https://stripe.com/docs/connect) */
  protected account$ = new BehaviorSubject<string>(undefined);

  /** The active Stripe instance observable */
  readonly stripe$: Observable<Stripe>;

  constructor(stripejs: Promise<StripeConstructor>, publicKey: string, options: StripeConstructorOptions) { 

    // Resolves the stripe instance from the StripeContructor promise
    this.stripe$ = from(stripejs).pipe( switchMap(stripeContructor => {

      // Checks upon the stripe account to optionally connect to
      return this.account$.pipe( map( stripeAccount => stripeContructor(publicKey, { 

        // Initializes the instance with the global options
        ...options,

        // Connects to the given account, if any
        stripeAccount

      })));

    }), shareReplay(1) );
  }

  /** Invokes the requested Stripe funciton */
  protected callStripe(signature: string, args): Promise<any> {

    // Resolves the active Stripe instance
    return this.stripe$.pipe( switchMap( stripe => {

      // Gets the requested funciton to call upon
      const fn = stripe[signature];

      // Verifies the request really belongs to a function 
      if(typeof fn !== 'function') { return throwError( new Error(`
        The requested signature '${signature}' is not a Stripe.js function. 
      `));}

      // Calls the Stripe function wrapping the result in a promise
      return Promise.resolve( fn(...args) );

    // Always convert the returning value into a promise
    }), take(1) ).toPromise(); 
  }
}
