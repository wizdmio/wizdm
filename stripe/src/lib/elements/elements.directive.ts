import { Directive, Input, Inject, Optional, InjectionToken } from '@angular/core';
import { map, switchMap, shareReplay } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { StripeService } from '@wizdm/stripe';

import type { StripeElements, StripeElementsOptions, StripeElementLocale, StripeElementType } from '@stripe/stripe-js';
import type { StripeElement, StripeElementOptions } from './generic-types';

/** StripeElementsModule configuration token */
export const STRIPE_ELEMENTS_OPTIONS = new InjectionToken<StripeElementsOptions>('wizdm.stripe.elements.options');

/** Relays the Elements funcitons enabling dynamic locale */
@Directive({
  selector: '[StripeElements]',
  exportAs: 'StripeElements'
})
export class StripeElementsDirective {

  private locale$ = new BehaviorSubject<StripeElementLocale>(undefined);
  private elements$: Observable<StripeElements>;

  constructor(stripe: StripeService, @Optional() @Inject(STRIPE_ELEMENTS_OPTIONS) options: StripeElementsOptions) { 

    this.elements$ = stripe.stripe$.pipe( 

      switchMap( stripe => this.locale$.pipe( 
        
        map( locale => stripe.elements({ 
        
          ...options, 
          
          locale          
        }))
      )),

      shareReplay(1)
    )
  }

  /** The Elements locale to use. The locale is automatically detected when undefined */
  @Input() set StripeElements(locale: StripeElementLocale) {
    this.locale$.next(locale);
  }

  /** Creates a Stripe Element of the given type using the given locale and options */
  public create<T extends StripeElementType>(elementType: T, options?: StripeElementOptions<T>): Observable<StripeElement<T>> {    
    return this.elements$.pipe( map( elements => elements.create(elementType as any, options as any) )) as any;
  }
}