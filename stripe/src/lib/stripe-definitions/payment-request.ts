/**
 * The Payment request object that can be used to make payments
 * @see https://stripe.com/docs/stripe-js/reference#the-payment-request-object
 */
export interface PaymentRequest {
  /**
   * Whether or not a payment can be made
   * NOTE: When no API is available it resolves with `null`
   *
   * @see https://stripe.com/docs/stripe-js/reference#payment-request-can-make-payment
   */
  canMakePayment(): Promise<CanMakePaymentResult | null>;

  /**
   * Shows the browser’s payment UI
   * NOTE: When using the paymentRequestButton Element, this is called for you under the hood
   * NOTE: This method must be called as the result of a user interaction (for example, in a click handler)
   *
   * @see https://stripe.com/docs/stripe-js/reference#payment-request-show
   */
  show(): void;

  /**
   * Updates the payment information
   * NOTE: can only be called when the browser payment UI is not showing
   *
   * @param options - Payment information that should be used by Stripe
   *
   * @see https://stripe.com/docs/stripe-js/reference#payment-request-update
   */
  update(options: UpdateOptions): void;

  /**
   * Register your event listener
   * @see https://stripe.com/docs/stripe-js/reference#payment-request-on
   */
  on(event: 'cancel', handler: () => void): void;
  on(event: 'token' | 'source', handler: (event: PaymentResponse) => void): void;
  on(event: 'shippingaddresschange', handler: (event: NewShippingAddress) => void): void;
  on(event: 'shippingoptionchange', handler: (event: NewShippingOptions) => void): void;
}

export interface CanMakePaymentResult {
  /**
   * true if the browser payment API supports Apple Pay.
   * NOTE: using the paymentRequestButton Element is automatically cross-browser.
   * If you use this PaymentRequest object to create a paymentRequestButton Element, you don‘t need to check applePay yourself
   */
  readonly applePay: boolean;
}

/**
 * @see https://stripe.com/docs/stripe-js/reference#payment-request-on
 */
export interface NewShippingAddress {
  /**
   * Calling this function with an UpdateDetails object merges your updates into the
   * current PaymentRequest object.
   */
  updateWith: (dataToUpdate: UpdateOptions) => void;

  /**
   * The customer's selected ShippingAddress.
   */
  shippingAddress: ShippingAddress;
}

export interface NewShippingOptions {
  /**
   * Calling this function with an UpdateDetails object merges your updates into the
   * current PaymentRequest object.
   */
  updateWith: (dataToUpdate: UpdateOptions) => void;

  /**
   * The selected shipping option
   */
  shippingOption: ShippingDetails;
}

/**
 * Payment options that can be set when updating the payment request
 * @see https://stripe.com/docs/stripe-js/reference#payment-request-update
 */
export interface UpdateOptions {
  /**
   * The currency in which the customer should be charged
   * @example 'usd'
   */
  currency: string;

  /**
   * The total amount the customer has to pay
   * NOTE: This object is shown to the customer in the browser‘s payment UI
   */
  total: PaymentItem;

  /**
   * An array of payment item objects
   * NOTE: The sum of the line item amounts does not need to add up to the total amount above
   * @see total
   *
   * @default []
   */
  displayItems?: PaymentItem[];

  /**
   * An array of possible shipping options
   * NOTE: This first one in the array will be listed as the default option
   *
   * @default []
   */
  shippingOptions?: ShippingDetails[];
}

/**
 * Configuration options for creating a payment request
 * @see https://stripe.com/docs/stripe-js/reference#stripe-payment-request
 */
export interface PaymentOptions extends UpdateOptions {
  /**
   * The two letter code representing your country
   * @example 'US'
   */
  country: string;

  /**
   * Whether or not the form should ask for the payer's name
   * @default false
   */
  requestPayerName?: boolean;

  /**
   * Whether or not the form should ask for the payer's email address
   * @default false
   */
  requestPayerEmail?: boolean;

  /**
   * Whether or not the form should ask for the payer's phone number
   * @default false
   */
  requestPayerPhone?: boolean;

  /**
   * Whether or not a shipping address should be requested
   * NOTE: Setting this to true requires `shippingOptions` to be set with at least one option!
   * @see shippingOptions
   */
  requestShipping?: boolean;
}

export interface PaymentItem {
  /**
   * The amount the user has to pay in the given currency
   * @see StripePaymentOptions.currency
   */
  amount: number;

  /**
   * A text that should be shown to the user
   */
  label: string;

  /**
   * Whether or not the payment should be executed immediately
   * If you might change this amount later (for example, after you have calculated shipping costs), set this to `true`
   */
  pending?: boolean;
}

// --- PAYMENT RESPONSE FROM STRIPE --- //
/**
 * @see https://stripe.com/docs/stripe-js/reference#payment-response-object
 */
export interface PaymentResponse {
  /**
   * NOTE: Only available when the event type 'token' was used
   */
  readonly token?: any;

  /**
   * NOTE: Only available when the event type 'source' was used
   */
  readonly source?: any;

  /**
   * A function to complete the payment and give feedback to the user
   * Call this when you have processed the token data provided by the API
   *
   * @param status - The status that should be shown to the user
   */
  complete: (status: CompleteStatus) => void;

  /**
   * Information about the payer
   * NOTE: This is only set if the corresponding field was set to `true` in the `PaymentOptions`
   *
   * @see PaymentOptions.requestPayerName
   * @see PaymentOptions.requestPayerEmail
   * @see PaymentOptions.requestPayerPhone
   */
  readonly payerName?: string;
  readonly payerEmail?: string;
  readonly payerPhone?: string;

  /**
   * The shipping address the payer selected
   */
  readonly shippingAddress: ShippingAddress;

  /**
   * The shipping option the payer selected
   */
  readonly shippingOption: ShippingDetails;

  /**
   * The unique name of the payment handler the customer chose to authorize payment
   * @example 'basic-card'
   */
  readonly methodName: string;
}

export type CompleteStatus =
  'success' |
  'fail' |
  'invalid_payer_name' |
  'invalid_payer_phone' |
  'invalid_payer_email' |
  'invalid_shipping_address';

/**
 * @see https://stripe.com/docs/stripe-js/reference#shipping-address-object
 */
export interface ShippingAddress {
  /**
   * Two-letter country code, capitalized
   * NOTE: The codes are specified by the ISO3166 alpha-2
   */
  country: string;

  /**
   * An array of address line items
   * @example ['185 Berry St.', 'Suite 500', 'P.O. Box 12345']
   */
  addressLine: string[];

  /**
   * The most coarse subdivision of a country
   * NOTE: Depending on the country, this might correspond to a state, a province, an oblast, a prefecture,
   * or something else along these lines.
   */
  region: string;

  /**
   * The name of a city, town, village, etc
   */
  city: string;

  /**
   * The postal code or ZIP code
   * NOTE: This is known as the PIN code in India
   */
  postalCode: string;

  /**
   * The name of the recipient.
   * NOTE: This might be a person, a business name, or contain “care of” (c/o) instructions
   */
  recipient: string;

  /**
   * The phone number of the recipient
   * NOTE: This is only filled if `requestPayerPhone` was set to `true`
   *
   * @see PaymentOptions.requestPayerPhone
   */
  phone: string;

  /**
   * The sorting code as used in, for example, France
   * NOTE: Not present on Apple platforms
   */
  sortingCode: string;

  /**
   * A logical subdivision of a city
   * NOTE: Not present on Apple platforms
   */
  dependentLocality: string;
}

/**
 * Settings for a shipping location
 * @see https://stripe.com/docs/stripe-js/reference#shipping-option-object
 */
export interface ShippingDetails {
  /**
   * A unique ID you create to keep track of this shipping option.
   * NOTE: You‘ll be told the ID of the selected option on changes and on completion.
   */
  id: string;

  /**
   * A short “title” for this shipping option.
   */
  label: string;

  /**
   * A longer description of this shipping option.
   */
  detail: string;

  /**
   * The shipping costs for this option
   * NOTE: If the cost of this shipping option depends on the shipping address the customer enters,
   * listen for the `shippingaddresschange` event.
   */
  amount: number;
}