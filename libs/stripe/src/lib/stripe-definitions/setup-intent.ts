
export interface SetupIntent {
  /**
   * Unique identifier for the object.
   */
  id: string;

  /**
   * Value is "setup_intent".
   */
  object: 'setup_intent';

  /**
   * ID of the Connect application that created the SetupIntent.
   */
  application: string | null;

  /**
   * Reason for cancellation of this SetupIntent.
   */
  cancelation_reason: SetupIntentCancelationReason | null;

  /**
   * The client secret of this SetupIntent. Used for client-side retrieval using a publishable key.
   * The client secret can be used to complete payment setup from your frontend.
   * It should not be stored, logged, embedded in URLs, or exposed to anyone other than the customer.
   * Make sure that you have TLS enabled on any page that includes the client secret.
   */
  client_secret: string;

  /**
   * Time at which the object was created. Measured in seconds since the Unix epoch.
   */
  created: number;

  /**
   * ID of the Customer this SetupIntent belongs to, if one exists.
   * If present, payment methods used with this SetupIntent can only be attached
   * to this Customer, and payment methods attached to other Customers cannot be
   * used with this SetupIntent.
   */
  customer: string | null;

  /**
   * An arbitrary string attached to the object. Often useful for displaying to users.
   */
  description?: string;

  /**
   * The error encountered in the previous SetupIntent confirmation.
   */
  last_payment_error: Error | null;

  /**
   * Has the value true if the object exists in live mode or the value
   * false if the object exists in test mode.
   */
  livemode: boolean;

  /**
   * Set of key-value pairs that you can attach to an object. This can be
   * useful for storing additional information about the object in a structured format.
   */
  metadata: { [key: string]: string };

  /**
   * If present, this property tells you what actions you need to take in
   * order for your customer to continue payment setup.
   */
  next_action: SetupIntentNextActionUseStripeSdk | SetupIntentNextActionRedirectToUrl;

  /**
   * The account (if any) for which the setup is intended.
   */
  on_behalf_of: string | null;

  /**
   * ID of the payment method used with this SetupIntent.
   */
  payment_method: string | null;

  /**
   * The list of payment method types (e.g. card) that this SetupIntent is allowed to set up.
   */
  payment_method_types: string[];

  /**
   * Status of this SetupIntent
   */
  status: SetupIntentStatus;

  /**
   * Indicates how the payment method is intended to be used in the future.
   * Use on_session if you intend to only reuse the payment method
   * when the customer is in your checkout flow. Use off_session if your
   * customer may or may not be in your checkout flow. If not provided,
   * this value defaults to off_session.
   */
  usage: 'on_session' | 'off_session';
}

export type SetupIntentCancelationReason = 'abandoned'
  | 'requested_by_customer'
  | 'duplicate';

export type SetupIntentStatus = 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'canceled'
  | 'succeeded';

export interface SetupIntentNextActionRedirectToUrl {
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
     * order to authenticate.
     */
    url: string;
  };
}

export interface SetupIntentNextActionUseStripeSdk {
  /**
   * Type of the next action to perform
   */
  type: 'use_stripe_sdk';
  /**
   * When confirming a SetupIntent with Stripe.js, Stripe.js depends on
   * the contents of this dictionary to invoke authentication flows. The
   * shape of the contents is subject to change and is only intended to
   * be used by Stripe.js.
   */
  use_stripe_sdk: any;
}