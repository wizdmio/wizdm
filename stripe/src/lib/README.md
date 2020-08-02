# Stripe for Angular and Angular Material
The @wizdm/stripe package brings all the functionalities of [Stripe Elements for the web](https://stripe.com/docs/stripe-js) into your Angular application. 

Stripe Elements is a set of prebuilt UI components available as a feature of Stripe.js v3. This package, wraps the Stripe Elements into components complying with the [Angular forms API](https://angular.io/guide/forms-overview), so, to be used according to both template-driven form and reactive form patterns. 

Additionally, the package supports [Angular Material Form Field](https://material.angular.io/components/form-field/overview), so, all the Stripe Elements can smootly blend in with all the other supported form field controls.

# Installation
Use `npm` to install the @wizdm/stripe module together with the official [@stripe/stripe-js](https://www.npmjs.com/package/@stripe/stripe-js) module which provides the typings:

```
npm install @stripe/stripe-js @wizdm/stripe
```

# Usage
Import the `StripeModule` in the root NgModule of your Angular project. Call the static `init()` function to configure the `StripeModule`
with your own Stripe public key along with any additional options.

``` typescript
import { StripeModule } from '@wizdm/stripe';

...

@NgModule({
  ...
  imports: [

    // Initialize the stripe.js module
    StripeModule.init('pk_test_xxxxxxxxxxxxxxxxxxxxx'),
    ...
  ]
})
export class AppModule();

```

## Styling Elements
Import StripeElementsModule in your feature module to include the Angular's form API support. The requested Stripe Elements will
be provided within an `iframe` from the Stripe's servers for PCI compliance. This means none of the styling you may provide from
your app's css will influence the appearance of the provided Elements. Use the module `init()` function to configure the 
[elements options](https://stripe.com/docs/js/elements_object/create#stripe_elements-options) instructing Elemetns about the
custom fonts to load within the iframe for the elements to fit your desired styling.

``` typescript
import { StripeElementsModule } from '@wizdm/stripe/elements';

...

@NgModule({
  ...
  imports: [

    // Initialize the stripe.js module
    StripeElementsModule.init({

      fonts: [
        { cssSrc: 'https://fonts.googleapis.com/css?family=Ubuntu:400,700' }
      ]      
    }),
    ...
  ]
})
export class MyModule();

```

Customize each element style using the `baseStyle` input. When settle to `auto` the styling values will be automatically 
detected from the computed style of the wrapping element.

## Process payments
Setup your form to collect all the payment information in your component template first:

``` html

  <form (ngSubmit)="pay()" #form="ngForm">

    <!-- Name -->
    <input [(ngModel)]="name" name="name" required>
      
    <!-- Email -->
    <input [(ngModel)]="email" name="email" email required>

    <!-- Amount -->
    <input [(ngModel)]="amount" required pattern="\d*"/>

    <!-- Credit Card Stripe Element -->
    <wm-stripe-card [(ngModel)]="card" baseStyle="auto" hidePostalCode name="card" required></wm-stripe-card>

    <!-- Submit button -->
    <button type="submit"[disabled]="!form.valid">Pay Now</button>

  </form>

```

Use the collected information with Stripe API to process the payment:

``` ts

@Component({
  ...
})
export class MyComponent {

  public card: StripeCardElement;
  public email: string = '';
  public name: string = '';
  public amount: number;

  constructor(@Inject(STRIPE) private stripe: Stripe) { }

  // Process the payment
  public pay() {

    // Starts by creating the payment intent server side
    this.createPaymentIntent({

      // Amount goes in cents
      amount: this.amount * 100,
      currency: 'usd'

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
      ...

    }).catch( e => {
      
      console.log("Transaction terminated", e);
      ...
    });
  }
}

```

Further usage information and reference details can be found in the [Wizdm documentation](https://wizdm.io/docs/stripe).