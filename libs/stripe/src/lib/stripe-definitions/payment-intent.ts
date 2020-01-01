import { PaymentMethod, BillingDetails } from './payment-method';
import { ShippingDetails } from './payment-request';
import { StripeError } from "./error";
import { Element } from './element';
import { Charge } from './charge';
import { List } from './list';

export interface PaymentIntent {
  /**
   * Unique identifier for the object.
   */
  id: string;

  /**
   * Value is "payment_intent".
   */
  object: 'payment_intent';

  /**
   * The amount in cents that is to be collected from this PaymentIntent.
   */
  amount: number;

  /**
   * The amount that can be captured with from this PaymentIntent (in cents).
   */
  amount_capturable: number;

  /**
   * The amount that was collected from this PaymentIntent (in cents).
   */
  amount_received: number;

  /**
   * ID of the Connect application that created the PaymentIntent.
   */
  application: string | null;

  /**
   * A fee in cents that will be applied to the invoice and transferred to the application owner's Stripe account.
   */
  application_fee_amount: number | null;

  /**
   * Populated when `status` is `canceled`, this is the time at which the PaymentIntent was canceled.
   * Measured in seconds since the Unix epoch.
   */
  canceled_at: number | null;

  /**
   * User-given reason for cancellation of this PaymentIntent.
   */
  cancelation_reason: PaymentIntentCancelationReason | null;

  /**
   * Capture method of this PaymentIntent.
   */
  capture_method: 'automatic' | 'manual';

  /**
   * Charges that were created by this PaymentIntent, if any.
   */
  charges: List<Charge>;

  /**
   * The client secret of this PaymentIntent. Used for client-side retrieval using a publishable key. Please refer to dynamic authentication guide on how client_secret should be handled.
   */
  client_secret: string;

  /**
   * Confirmation method of this PaymentIntent.
   */
  confirmation_method: 'automatic' | 'manual';

  /**
   * Time at which the object was created. Measured in seconds since the Unix epoch.
   */
  created: number;

  /**
   * Three-letter ISO currency code, in lowercase. Must be a supported currency.
   */
  currency: string;

  /**
   * ID of the Customer this PaymentIntent is for if one exists.
   */
  customer: string | null;

  /**
   * An arbitrary string attached to the object. Often useful for displaying to users.
   */
  description?: string;

  /**
   * The payment error encountered in the previous PaymentIntent confirmation.
   */
  last_payment_error: Error | null;

  /**
   * Has the value true if the object exists in live mode or the value false
   * if the object exists in test mode.
   */
  livemode: boolean;

  metadata: { [key:string]: string };

  /**
   * If present, this property tells you what actions you need to take in order
   * for your customer to fulfill a payment using the provided source.
   */
  next_action: PaymentIntentNextActionUseStripeSdk | PaymentIntentNextActionRedirectToUrl;

  /**
   * The account (if any) for which the funds of the PaymentIntent are intended.
   * See the PaymentIntents Connect usage guide for details.
   */
  on_behalf_of: string | null;

  /**
   * ID of the payment method used in this PaymentIntent.
   */
  payment_method: string | null;

  /**
   * The list of payment method types (e.g. card) that this PaymentIntent is allowed to use.
   */
  payment_method_types: string[];

  /**
   * Email address that the receipt for the resulting payment will be sent to.
   */
  receipt_email: string | null;

  /**
   * ID of the review associated with this PaymentIntent, if any.
   */
  review: string | null;

  /**
   * Shipping information for this PaymentIntent.
   */
  shipping: ShippingDetails | null;

  /**
   * The ID of a Source (e.g. 'src_abc123' or 'card_abc123').
   * Will be null unless this PaymentIntent was created with a source
   * instead of a payment_method. (Undocumented as of August 2019)
   */
  source: string | null;

  /**
   * Extra information about a PaymentIntent. This will appear on your
   * customer’s statement when this PaymentIntent succeeds in creating a charge.
   */
  statement_descriptor: string | null;

  /**
   * The several states the PaymentIntent goes through until it it either canceled or succeeds.
   */
  status: PaymentIntentStatus;

  /**
   * The data with which to automatically create a Transfer when the payment is finalized.
   */
  transfer_data: {
      /**
       * The account (if any) the payment will be attributed to for tax reporting,
       * and where funds from the payment will be transferred to upon payment success.
       */
      destination: string;
  } | null;

  /**
   * A string that identifies the resulting payment as part of a group.
   */
  transfer_group: string | null;
}

export type PaymentIntentStatus = 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'requires_capture'
  | 'canceled'
  | 'succeeded';

export type PaymentIntentCancelationReason = 'duplicate'
  | 'fraudulent'
  | 'requested_by_customer'
  | 'abandoned'
  // Generated by Stripe internally:
  | 'failed_invoice'
  | 'void_invoice'
  | 'automatic';

export interface PaymentIntentNextActionRedirectToUrl {
  /**
   * Type of the next action to perform
   */
  type: 'redirect_to_url';
  /**
   * Contains instructions for authenticating a payment by
   * redirecting your customer to another page or application.
   */
  redirect_to_url: {
    /**
     * If the customer does not exit their browser while
     * authenticating, they will be redirected to this
     * specified URL after completion.
     */
    return_url: string;

    /**
     * The URL you must redirect your customer to in
     * order to authenticate the payment.
     */
    url: string;
  };
}

export interface PaymentIntentData {
  /**
   * Either the id of an existing PaymentMethod, or an object containing data to create a PaymentMethod with. 
   * See the use case sections for details.
   */
  payment_method: string | PaymentMethod;

  /** The shipping details for the payment, if collected. */
  shipping?: ShippingDetails;

  /**
   * If you are handling next actions yourself, pass in a return_url. 
   * If the subsequent action is redirect_to_url, this URL will be used on the return path for the redirect.
   */
  return_url?: string;
  
  /** Email address that the receipt for the resulting payment will be sent to. */
  receipt_email?: string;

  /**
   * If the PaymentIntent is associated with a customer and this parameter is set to true, the provided payment method will be attached to the customer. 
   * Default is false.
   */
  save_payment_method?: boolean;

  /** Indicates that you intend to make future payments with this PaymentIntent's payment method. */
  setup_future_usage?: boolean
}

export interface CardPaymentIntentData {

  payment_method: {
    card: Element<'card'|'iban'>;
    billing_details: BillingDetails;
  }
}

export interface IdealPaymentIntentData {

  payment_method: {
    ideal: Element<'ideal'>;
  }
  return_url?: string;
}

export interface IbanPaymentIntentData {

  payment_method: {
    card: Element<'iban'>;
    billing_details: BillingDetails;
  }
}

export interface PaymentIntentOptions {
  /**
   * Set this to false if you want to handle next actions yourself, or if you want to defer next action handling until later (e.g. for use in the PaymentRequest API). 
   * Default is true.
   */
  handleActions?: boolean;
}

export interface PaymentIntentNextActionUseStripeSdk {
  /**
   * Type of the next action to perform
   */
  type: 'use_stripe_sdk';
  /**
   * When confirming a PaymentIntent with Stripe.js,
   * Stripe.js depends on the contents of this dictionary
   * to invoke authentication flows. The shape of the contents
   * is subject to change and is only intended to be used by Stripe.js.
   */
  use_stripe_sdk: any;
}

export interface PaymentIntentResult {
  /**
   * The generated string that can be used for communication with the backend
   */
  paymentIntent?: PaymentIntent;

  /**
   * There was an error. This includes client-side validation errors.
   */
  error?: StripeError;
}