import { InjectionToken } from '@angular/core';
import { PayPal, PayPalConfig } from './types/paypal';

/** PayPal configuration token */
export const PAYPAL_CONFIG = new InjectionToken<PayPalConfig>('wizdm.paypal.config');

/** PayPal initializer token */
export const PAYPAL_INSTANCE = new InjectionToken<Promise<PayPal>>('wizdm.paypal.instance');

/** Retrives the global PayPal object  */
export function getPayPal(): PayPal {
  return window && (window as any).paypal;
}

const PAYPAL_JS_SDK = 'https://www.paypal.com/sdk/js?';

/** PayPal JavaScript SDK loader  */
export function loadPayPalSdk(config: PayPalConfig): Promise<PayPal> {

  // Verifies whenever PayPal has already being loaded
  const payPal = getPayPal();

  // Returns the existing instance or load the script
  return payPal ? Promise.resolve( payPal ) : new Promise( (resolve, reject) => {

    try {

      // We'll be trying to get the existing script or injecting a new one
      const findScript = () => document.querySelector<HTMLScriptElement>(`script[src^="${PAYPAL_JS_SDK}"]`);
      const injectScript = () => {

        const script = document.createElement('script');

        script.src = payPalSdkUrl(config);
        script.type = 'text/javascript';
        script.defer = true;
        script.async = true;
        
        (document.head || document.body).appendChild(script);

        return script;
      };

      // Seeks for the script elemennt or inject a new one
      const script = findScript() || injectScript();

      // Listens for error or completion
      script.addEventListener('error', () => reject( new Error("Unable to load PayPal SDK") ));
      script.addEventListener('load', () => resolve( getPayPal() ));
    }
    catch(e) { reject(e); }
  });
}

/** Builds the PayPal SDK url according to the PayPalConfig */
export function payPalSdkUrl(config: PayPalConfig): string {

   const hyphenize = (camel: string) => {
    return camel.replace(/([A-Z])/g, $1 => {
      return '-' + $1.toLowerCase();
    });
  }

  return Object.keys(config).reduce( (url, token, idx) => {
    return url + (idx && '&' || '') + hyphenize(token) + '=' + config[token];
  }, PAYPAL_JS_SDK);
}