import { NgModule } from '@angular/core';
import { StripeCardNumber } from './card-number.component';
import { StripeCardExpiry} from './card-expiry.component';
import { StripeCardCvc } from './card-cvc.component';
import { StripeCard } from './card.component';

@NgModule({
  imports: [ ],
  declarations: [ StripeCard, StripeCardNumber, StripeCardExpiry, StripeCardCvc ],
  exports: [ StripeCard, StripeCardNumber, StripeCardExpiry, StripeCardCvc ]
})
export class StripeCardModule { }