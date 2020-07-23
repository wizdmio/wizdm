import { Component } from '@angular/core';
import { Stripe, CardElement } from '@wizdm/stripe';
import { FunctionsService, Callable } from '@wizdm/connect/functions';

@Component({
  selector: 'wm-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss']
})
export class DonateComponent {

  public name: string = '';
  public email: string = '';
  public amount: number;
  public card: CardElement;
  public currency: 'eur'|'usd' = 'eur';
  public progress: boolean = false;

  public toggleCurrency() {
    this.currency = this.currency === 'eur' ? 'usd' : 'eur';
  }

  private createPaymentIntent = this.functions.callable('createPaymentIntent');

  constructor(private stripe: Stripe, private functions: FunctionsService) { }

  public pay() {

    console.log(this.stripe);

    this.progress = true;

    this.createPaymentIntent({
      amount: this.amount * 100,
      currency: this.currency,
      email: this.email
    })

    // Simulates the async process...
    setTimeout(() => {

      this.progress = false;

      const clientSecret = '123_secret_456';
    /**  
     * Call on your server to create a payment intent getting back a clientSecret
     * @see https://stripe.com/docs/payments/accept-a-payment
     * 
     *   stripe.paymentIntents.create({
     *     amount: 1099, // * 100
     *     currency: 'eur',
     *     receipt_email: email
     *   }).then( intent => intent.clientSecret );
     * 
     */ 

    this.stripe.confirmCardPayment( clientSecret, {
      payment_method: {
        card: this.card,
        billing_details: {
          name: this.name,
          //email
        }
      }
    });

    }, 3000);
  }

}
