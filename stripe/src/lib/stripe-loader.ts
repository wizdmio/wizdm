import type { StripeConstructor } from '@stripe/stripe-js';

/** Retrives the global StripeJS object  */
export function getStripeJS(): StripeConstructor {
  return (!!window ? (window as any).Stripe : undefined);
}

/** Stripe.js v3 script loader. We do not use the official loader provided
 * by @stripe/stripe-js since we may need creating multiple Stripe instances
 * while connecting to multiple accounts */
export function loadStripeJS(): Promise<StripeConstructor> {

  /** The official stripe-js link. The script must be loaded from the stripe server for PCI compliance */
  const STRIPE_V3_URL = 'https://js.stripe.com/v3';

  // Try to get the StripeJS instance first
  const StripeJS = getStripeJS();

  // Proceed in loading the script asyncronously
  return StripeJS ? Promise.resolve( StripeJS ) : new Promise( (resolve, reject) => {

    try {

      // We'll be trying to get the existing script or injecting a new one
      const findScript = () => document.querySelector<HTMLScriptElement>(`script[src^="${STRIPE_V3_URL}"]`);
      const injectScript = () => {

        const script = document.createElement('script');
        script.src = STRIPE_V3_URL;
        script.type = 'text/javascript';
        script.async = true;

        (document.head || document.body).appendChild(script);

        return script;
      }

      // Seeks for the script elementn or inject a new one
      const script = findScript() || injectScript();

      // Listens for error or completion
      script.addEventListener('error', () => reject( new Error("Unable to load StripeJS") ));
      script.addEventListener('load', () => resolve( getStripeJS() ));
    }
    catch(e) { reject(e); }
  });
}