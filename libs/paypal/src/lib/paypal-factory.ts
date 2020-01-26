import { InjectionToken } from '@angular/core';
import { PayPal, PayPalConfig } from './types/paypal';

export const PayPalConfigToken = new InjectionToken<PayPalConfig>('wizdm.paypal.config');

/** Retrives the global PayPal object  */
export function getPayPal(): PayPal {
  return window && (window as any).paypal;
}

/** PayPal JavaScript SDK loader  */
export function loadPayPalSdk(config: PayPalConfig): Promise<PayPal> {
  // Verifies whenever PayPal has already being loaded
  const payPal = getPayPal();
  // Returns the existing instance or load the script
  return payPal ? Promise.resolve( payPal ) : new Promise( (resolve, reject) => {

    const script = document.createElement('script');

    script.src = payPalSdkUrl(config);
    script.type = 'text/javascript';
    script.defer = true;
    script.async = true;

    script.onerror = () => reject( new Error("Unable to load PayPal") ); 
    script.onload = () => resolve( getPayPal() );
   
    document.body.appendChild(script);
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
  },'https://www.paypal.com/sdk/js?');
}
