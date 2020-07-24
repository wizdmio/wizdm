import { Component } from '@angular/core';
import { FunctionsService } from '@wizdm/connect/functions';
import { Stripe, CardElement, PaymentIntent } from '@wizdm/stripe';
import { $animations } from './donate.animations';

@Component({
  selector: 'wm-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss'],
  animations: $animations
})
export class DonateComponent {

  public card: CardElement;
  public email: string = '';
  public name: string = '';
  public amount: number;
  public currency: 'eur'|'usd' = 'eur';

  public error: string;
  public ready: boolean = false;
  public progress: boolean = false;
  
  readonly defaultAmoutOptions = [
    { label: "5",   value: 5 },
    { label: "25",  value: 25 },
    { label: "100", value: 100 }
  ];

  public toggleCurrency() {
    this.currency = this.currency === 'eur' ? 'usd' : 'eur';
  }

  constructor(private stripe: Stripe, private functions: FunctionsService) { }

  private createPaymentIntent = this.functions.callable<any, PaymentIntent>('createPaymentIntent');

  public pay() {

    this.progress = true;
    this.error = '';

    console.log("Creating payment intent for", this.amount, this.currency);

    this.createPaymentIntent({

      amount: this.amount * 100,
      currency: this.currency

    }).then( intent => {

      console.log("Confirming payment intent", intent.id);
      
      return this.stripe.confirmCardPayment( intent.client_secret, {
      
        payment_method: {
          card: this.card,
          billing_details: {
            name: this.name,
            email: this.email
          }
        }
      });

    }).then( result => {

      console.log("Transaction completed", result.paymentIntent?.status);

      this.error = result.error?.message;
      
      this.progress = false; 

      this.card.clear();
    });
  }
}
