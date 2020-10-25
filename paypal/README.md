# PayPal Smart Buttons for Angular
The @wizdm/paypal package brings all the functionalities of [PayPal Smart Payment Buttons](https://developer.paypal.com/docs/checkout/#try-the-buttons) into your Angular application. 

PayPal Checkout with Smart Payment Buttons gives your buyers a simplified and secure checkout experience. PayPal intelligently presents the most relevant payment types to your shoppers, automatically, making it easier for them to complete their purchase using methods like Pay with Venmo, PayPal pay later offers, credit card payments, iDEAL, Bancontact, Sofort, and other payment types. 

# Installation
Use `npm` to install the @wizdm/paypal module:

```
npm install @wizdm/paypal
```

# Usage
Import the `PayPalModule` in the root NgModule of your Angular project. Call the static `init()` function to configure the module
with your own PayPal [client-id](https://developer.paypal.com/docs/checkout/reference/customize-sdk/#client-id) and all the other relevant [query parameters](https://developer.paypal.com/docs/checkout/reference/customize-sdk/#query-parameters).

``` typescript
import { PayPalModule } from '@wizdm/paypal';

...

@NgModule({
  ...
  imports: [

    // Initialize the paypal sdk
    PayPalModule.init({ cliendId: 'sb' }),
    ...
  ]
})
export class AppModule();

```

## Process payments
In order to process a payment, you simply add a `wm-paypal` component to your template.

``` html

<!-- Simply provide the order request to be processed -->
<wm-paypal [request]="order"></wm-paypal>

```

THen you capture the payment transaction implementing the onApprove hook:

``` ts

@Component({
  ...
  // Injects the component as a PayPalProcessor
  providers: [ { provide: PayPalProcessor, useExisting: forwardRef(() => MyComponent) }]
})
export class MyComponent implements OnApprove {

  public order: OrderRequest = {
    intent: 'CAPTURE', 
    purchase_units: [{
      amount: {
        currency_code: 'EUR',
        value: '9.99'
      }
    }]
  };

  // Implements the onApprove hook
  onApprove(data: OnApproveData, actions: OnApproveActions) {
    
    console.log('Transaction Approved:', data);

    // Captures the trasnaction
    return actions.order.capture().then(details => {

      console.log('Transaction completed by', details);

      // Call your server to handle the transaction
      return Promise.reject('Transaction aborted by the server');
    });
  }
}

```

## Standalone buttons
By default, the Smart Payment Buttons automatically render all eligible buttons in a single location on your page. 


If your use-case permits, you can render individual, standalone buttons for each supported payment method. For example, render the PayPal, Venmo, PayPal pay later offers, and Alternative Payment Method buttons on different parts of the checkout page, alongside different radio buttons, or on entirely different pages.

``` html

<!-- Renders the PayPal button only -->
<wm-paypal [request]="order" fundingSource="paypal"></wm-paypal>

<!-- Renders the Credit or debit cards payment button only -->
<wm-paypal [request]="order" fundingSource="card"></wm-paypal>


```

Even with standalone buttons, your integrations take advantage of the smart eligibility logic the PayPal JavaScript SDK provides, meaning only the supported buttons for the current buyer display.


## Handling Cancellation

Payment cancellations and errors can be handled using regular events fired from the component.

``` html

<wm-paypal [request]="order" (cancel)="onCancel($event)" (error)="onError($event)"></wm-paypal>

```

## Customize the buttons

There are several [style options](https://developer.paypal.com/docs/checkout/integration-features/customize-button/) that you can use to customize your Smart Payment Button.

``` html

<wm-paypal 
  [request]="order"
  layout="layout" 
  color="blue" 
  shape="pill" 
  height="40"
></wm-paypal>

```

Further usage information and reference details can be found in the [Wizdm documentation](https://wizdm.io/docs/paypal).