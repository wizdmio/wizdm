import { Component, Inject } from '@angular/core';
import { FunctionsService } from '@wizdm/connect/functions';
import { Stripe, StripeCardElement, PaymentIntent } from '@stripe/stripe-js';
//import { Stripe, CardElement, PaymentIntent } from '@wizdm/stripe';
import { $animations } from './donate.animations';

@Component({
  selector: 'wm-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss'],
  animations: $animations
})
export class DonateComponent {

  public card: StripeCardElement;
  public email: string = '';
  public name: string = '';
  public amount: number;
  public currency: 'eur'|'usd' = 'eur';

  public error: string;
  public ready: boolean = false;
  public progress: boolean = false;
  public completed: boolean = false;
  
  readonly defaultAmoutOptions = [
    { label: "5",   value: 5 },
    { label: "25",  value: 25 },
    { label: "100", value: 100 }
  ];

  /** Toggles the curency between EUR and USD */
  public toggleCurrency() {
    this.currency = this.currency === 'eur' ? 'usd' : 'eur';
  }

  constructor(@Inject('Stripe') private stripe: Stripe, private functions: FunctionsService) { }

  // createPaymentIntent runs server side on cloudFunctions
  private createPaymentIntent = this.functions.callable<any, PaymentIntent>('createPaymentIntent');

  // Process the payment
  public pay() {

    this.completed = false;
    this.progress = true;
    this.error = '';

    console.log("Creating payment intent for", this.amount, this.currency);

    // Starts by creating the payment intent server side
    this.createPaymentIntent({
      // Amount goes in cents
      amount: this.amount * 100,
      currency: this.currency

    }).then( intent => {

      console.log("Confirming payment intent", intent.id);
      
      // Once creates, use the client_secret to confirm the intent with the credit card details
      // from the card element
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
      // Tracks the errors, if any
      this.error = result.error?.message;
      // Stops the progress
      this.progress = false; 
      // Displays the completion 
      this.completed = !this.error;
      // Clears the card
      this.card.clear();

    }).catch( e => {
      
      console.log("Transaction terminated", e);
      // Tracks the errors, if any
      this.error = e.code;
      // Stops the progress
      this.completed = this.progress = false; 
      // Clears the card
      this.card.clear();
    });
  }
}
