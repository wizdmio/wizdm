import { StripeError } from "./error";
import { Customer } from "./customer";
import { Mandate } from './mandate';
import { Token } from "./token";

/**
 * @see https://stripe.com/docs/api#sources
 */
export interface Source {
  /**
   * Unique identifier for the object
   */
  id: string;

  object: 'source';

  /**
   * A positive integer in the smallest currency unit (that is, 100 cents for $1.00,
   * or 1 for ¥1, Japanese Yen being a zero-decimal currency) representing the total
   * amount associated with the source
   */
  amount: number;

  /**
   * The client secret of the source.
   * Used for client-side retrieval using a publishable key.
   */
  client_secret: string;

  /**
   * Information related to the code verification flow
   * Present if the source is authenticated by a verification code
   */
  code_verification?: CodeVerification;

  /**
   * Time at which the object was created.
   * Measured in seconds since the Unix epoch.
   * (Timestamp)
   */
  created: number;

  /**
   * Three-letter ISO code for the currency associated with the source
   */
  currency: string;

  /**
   * The authentication flow of the source
   */
  flow: 'redirect' | 'receiver' | 'code_verification' | 'none';

  /**
   * LIVE MODE = true
   * TEST MODE = false
   */
  livemode: boolean;

  /**
   * Your own saved information with this bank account
   */
  metadata: { [key: string]: string };

  /**
   * Information about the owner of the payment instrument that may be used or
   * required by particular source types.
   */
  owner: Customer;

  /**
   * Information related to the receiver flow.
   * Present if the source is a receiver
   */
  receiver?: Receiver;

  /**
   * Information related to the redirect flow.
   * Present if the source is authenticated by a redirect
   */
  redirect?: Redirect;

  /**
   * Extra information about a source
   * NOTE: This will appear on your customer’s statement every time you charge the source
   */
  statement_descriptor: string;

  /**
   * The status of the source
   * NOTE: Only `chargeable` sources can be used to create a charge
   */
  status: 'pending' | 'canceled' | 'failed' | 'consumed' | 'chargeable';

  /**
   * The type of the source.
   * NOTE: The type is a payment method
   */
  type: SourceType;

  /**
   * A matching name to the type with extra information about the payment method
   * @see type
   */
  [key: string]: any;

  /**
   * Whether this source should be reusable or not
   */
  usage: 'reusable' | 'reusable';
}

export type SourceType =
  'ach_credit_transfer' |
  'ach_debit' |
  'alipay' |
  'bancontact' |
  'card' |
  'card_present' |
  'eps' |
  'giropay' |
  'ideal' |
  'multibanco' |
  'p24' |
  'paper_check' |
  'sepa_credit_transfer' |
  'sepa_debit' |
  'sofort' |
  'three_d_secure';

// --- CODE VERIFICATION --- //
export interface CodeVerification {
  /**
   * The number of attempts remaining to authenticate the
   * source object with a verification code
   */
  attempts_remaining: number;

  /**
   * The status of the code verification
   */
  status: 'pending' | 'attempts_remaining' | 'succeeded' | 'failed' | 'attempts_remaining';
}

// --- REDIRECT INFORMATION --- //
export interface Redirect {
  /**
   * The failure reason for the redirect
   * Present only if the redirect status is `'failed'`
   */
  failure_reason?: 'user_abort' | 'declined' | 'processing_error';

  /**
   * The URL you provide to redirect the customer to after they authenticated their payment
   */
  return_url: string;

  /**
   * The status of the redirect
   * - Pending: ready to be used by your customer to authenticate the transaction
   * - succeeded: succesful authentication, cannot be reused
   * - not_required: redirect should not be used
   * - failed: failed authentication, cannot be reused
   */
  status: 'pending' | 'succeeded' | 'not_required' | 'failed';

  /**
   * The URL provided to you to redirect a customer to as part of a redirect
   * authentication flow
   */
  url: string;
}

// --- RECEIVER INFORMATION --- //
export interface Receiver {
  /**
   * The address of the receiver source
   * NOTE: This is the value that should be communicated to the customer to send their funds to
   */
  address: string;

  /**
   * The total amount that was charged by you
   * NOTE: The amount charged is expressed in the source’s currency
   */
  amount_charged: number;

  /**
   * The total amount received by the receiver source
   */
  amount_received: number;

  /**
   * The total amount that was returned to the customer
   * NOTE: The amount charged is expressed in the source’s currency
   */
  amount_returned: number;
}

// --- DATA TO CREATE A SOURCE --- //
/**
 * @see https://stripe.com/docs/api#create_source
 */
export interface SourceData {
  /**
   * The type of the source to create
   */
  type: SourceType;

  /**
   * This is the amount for which the source will be chargeable once ready
   */
  amount: number;

  /**
   * Three-letter ISO code for the currency associated with the source
   */
  currency: string;

  /**
   * The authentication flow of the source
   */
  flow: 'redirect' | 'receiver' | 'code_verification' | 'none';

  /**
   * Whether this source should be reusable or not
   */
  usage: 'reusable' | 'single_use';

  /**
   * Information about a mandate possiblity attached to a source object
   * (generally for bank debits) as well as its acceptance status
   */
  mandate?: Mandate;

  /**
   * Extra data you want to add to the source object
   */
  metadata?: { [key: string]: string };

  /**
   * Information about the owner of the payment instrument that may be used or
   * required by particular source types.
   */
  owner?: Customer;

  /**
   * Can be set only if the source is a receiver
   */
  receiver?: Receiver;

  /**
   * Required if the source is authenticated by a redirect
   */
  redirect?: Redirect;

  /**
   * An arbitrary string to be displayed on your customer’s statement
   * @example if your website is RunClub and the item you’re charging for is a race ticket,
   * you may want to specify a statement_descriptor of RunClub 5K race ticket.
   */
  statement_descriptor?: string;

  three_d_secure_2_eap?: any;

  /**
   * When passed, token properties will override source parameters
   */
  token?: Token;
}

// --- RESPONSE FROM STRIPE WHEN CREATING OR FETCHING A SOURCE --- //
export interface SourceResult {
  /**
   * The identifier of the source to be retrieved
   */
  source: Source;

  /**
   * There was an error. This includes client-side validation errors.
   */
  error?: StripeError;
}