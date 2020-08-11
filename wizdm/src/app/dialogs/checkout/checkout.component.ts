import type { StripeCardElement, PaymentIntent, StripeError } from '@stripe/stripe-js';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { delay, startWith, switchMap } from 'rxjs/operators';
import { FunctionsService } from '@wizdm/connect/functions';
import { DarkModeObserver } from 'app/utils/platform';
import { Component, Inject } from '@angular/core';
import { environment } from 'env/environment';
import { $animations } from './checkout.animations';
import { StripeService } from '@wizdm/stripe';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'wm-pay',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  animations: $animations
})
export class CheckoutComponent {

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

  readonly autoMode$: Observable<any>;

  /** Toggles the curency between EUR and USD */
  public toggleCurrency() {
    this.currency = this.currency === 'eur' ? 'usd' : 'eur';
  }

  constructor(@Inject(MAT_DIALOG_DATA) data: any, private ref: MatDialogRef<any>, private stripe: StripeService, private functions: FunctionsService, dark: DarkModeObserver) { 

    // Uses an observable to refresh the Card Element automatic style detection on theme changes
    this.autoMode$ = dark.pipe( switchMap( () => of('auto').pipe( delay(0), startWith({}) )));
  }

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
      currency: this.currency,
      // Enables testMode when in developent so the private test key will be used instead of the live one.
      testMode: !environment.production

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

    }).catch( (e: StripeError) => {
      
      console.log("Transaction terminated", e);
      // Tracks the errors, if any
      this.error = e.message || e.code;
      // Stops the progress
      this.completed = this.progress = false; 
      // Clears the card
      this.card.clear();
    });
  }
}
