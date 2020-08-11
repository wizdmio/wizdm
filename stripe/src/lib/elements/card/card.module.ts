import { StripeCardNumber } from './card-number.component';
import { StripeCardExpiry } from './card-expiry.component';
import { StripeCardCvc } from './card-cvc.component';
import { StripeCard } from './card.component';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [ ],
  declarations: [ StripeCard, StripeCardNumber, StripeCardExpiry, StripeCardCvc ],
  exports: [ StripeCard, StripeCardNumber, StripeCardExpiry, StripeCardCvc ]
})
export class StripeCardModule { }