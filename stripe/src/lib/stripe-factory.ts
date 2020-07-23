import { ElementsOptions, ElementType, ElementOptions } from './definitions/element';
import { StripeJS, Stripe, StripeOptions } from './definitions';
import { InjectionToken } from '@angular/core';

export interface StripeConfig<T extends ElementType = any> {
  publicKey: string;
  options? : StripeOptions;
  elementsOptions?: ElementsOptions; 
  elementOptions?: ElementOptions<T>;
}

export const StripeConfigToken = new InjectionToken<StripeConfig>('wizdm.stripe.config');

/** Retrives the global StripeJS object  */
export function getStripeJS(): StripeJS {
  return (!!window ? (window as any).Stripe : undefined);
}

/** Instantiates a Stripe istance accoding to the provided options */
export function stripeFactory(config: StripeConfig): Stripe { 

  const StripeJS = getStripeJS();
  if(!StripeJS) {
    throw new Error('StripeJS loading failed');
  }

  if(!config || typeof config.publicKey !== 'string') {
    throw new Error('A valid publicKey must be provided');
  }

  return StripeJS( config.publicKey, config.options );
}

/** Stripe.js v3 script loader */
export function loadStripeJS(): Promise<StripeJS> {

  const StripeJS = getStripeJS();

  return StripeJS ? Promise.resolve( StripeJS ) : new Promise( (resolve, reject) => {

    const script = document.createElement('script');

    script.src = 'https://js.stripe.com/v3/';
    script.type = 'text/javascript';
    script.defer = true;
    script.async = true;

    script.onerror = () => reject( new Error("Unable to load StripeJS") ); 
    script.onload = () => resolve( getStripeJS() );
   
    document.head.appendChild(script);
  });
}