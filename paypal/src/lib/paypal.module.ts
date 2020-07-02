import { NgModule, ModuleWithProviders, Inject, Optional, APP_INITIALIZER } from '@angular/core';
import { getPayPal, loadPayPalSdk, PayPalConfigToken } from './paypal-factory';
import { PayPal, PayPalConfig } from './types/paypal';
import { PayPalButtons } from './paypal.component';

@NgModule({
  declarations: [ PayPalButtons ],
  exports: [ PayPalButtons ]
})
export class PayPalModule {
  static init(config: PayPalConfig): ModuleWithProviders<PayPalModule> {
    return {
      ngModule: PayPalModule,
      providers: [
        /** Provides the global PayPalConfig object */
        { provide: PayPalConfigToken, useValue: config },
        /** Loads the PayPal SDK during app initialization */
        { provide: APP_INITIALIZER, 
          useFactory: (config) => () => loadPayPalSdk(config), 
          deps: [ [ new Optional(), new Inject(PayPalConfigToken) ] ], 
          multi: true },
        /** Provides the PayPal instance */
        { provide: PayPal, useFactory: getPayPal }
      ]
    };
  }
}