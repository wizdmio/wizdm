import { StripeCardNumber, StripeCardNumberControl } from './card-number.component';
import { StripeCardExpiry, StripeCardExpiryControl } from './card-expiry.component';
import { StripeCardCvc, StripeCardCvcControl } from './card-cvc.component';
import { StripeCard, StripeCardControl } from './card.component';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [ ],
  declarations: [ 
    StripeCard, StripeCardControl, 
    StripeCardNumber, StripeCardNumberControl, 
    StripeCardExpiry, StripeCardExpiryControl, 
    StripeCardCvc, StripeCardCvcControl
  ],
  exports: [ 
    StripeCard, StripeCardControl, 
    StripeCardNumber, StripeCardNumberControl, 
    StripeCardExpiry, StripeCardExpiryControl,
    StripeCardCvc, StripeCardCvcControl 
  ]
})
export class StripeCardModule { }