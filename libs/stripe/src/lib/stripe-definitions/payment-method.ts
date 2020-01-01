import { ShippingAddress } from "./payment-request";
import { StripeError } from "./error";
import { Element } from './element';

export type PaymentMethodType = 'card' | 'ideal' | 'sepa_debit';

export interface PaymentMethod {
  /**
   * The type of the PaymentMethod. An additional hash is included on the
   * PaymentMethod with a name matching this value. It contains additional
   * information specific to the PaymentMethod type.
   */
  type: PaymentMethodType;

  /**
   * The unique identifier for the object
   */
  id: string;

  /**
   * Value is "payment_method"
   */
  object: 'payment_method';

  /**
   * Billing information associated with the PaymentMethod that may be
   * used or required by particular types of payment methods.
   */
  billing_details: BillingDetails;

  /**
   * If this is a card PaymentMethod, this hash contains details about the card.
   */
  card?: PaymentMethodCard;

  /**
   * If this is an card_present PaymentMethod, this hash contains details
   * about the Card Present payment method.
   */
  card_present?: any;

  /**
   * Time at which the object was created. Measured in seconds since the
   * Unix epoch.
   */
  created: number;

  /**
   * The ID of the Customer to which this PaymentMethod is saved.
   * This will not be set when the PaymentMethod has not been saved to a Customer.
   */
  customer: string | null;

  /**
   * Has the value true if the object exists in live mode or the value
   * false if the object exists in test mode.
   */
  livemode: boolean;

  metadata: { [key: string]: string };
}

export interface PaymentMethodCard {
  /**
   * Card brand
   */
  brand: 'amex'|'diners'|'discover'|'jcb'|'mastercard'|'unionpay'|'visa'|'unknown';

  /**
   * Checks on Card address and CVC if provided.
   */
  checks: {
      address_line1_check: boolean | null;
      address_postal_code_check: boolean | null;
      cvc_check: boolean | null;
  };

  /**
   * Two-letter ISO code representing the country of the card. You
   * could use this attribute to get a sense of the international
   * breakdown of cards you’ve collected.
   */
  country: string;

  /**
   * Two-digit number representing the card’s expiration month.
   */
  exp_month: number;

  /**
   * Four-digit number representing the card’s expiration year.
   */
  exp_year: number;

  /**
   * Uniquely identifies this particular card number. You can use
   * this attribute to check whether two customers who’ve signed
   * up with you are using the same card number, for example.
   */
  fingerprint: string;

  /**
   * Card funding type
   */
  funding: 'credit'|'debit'|'prepaid'|'unknown';

  /**
   * Details of the original PaymentMethod that created this object.
   */
  generated_from: {
      charge?: string | null;
      payment_method_details?: PaymentMethodDetails | null;
  };

  /**
   * The last four digits of the card.
   */
  last4: string;

  /**
   * Contains details on how this Card maybe be used for 3D Secure authentication.
   */
  three_d_secure_usage?: {
      supported?: boolean;
  };

  /**
   * If this Card is part of a card wallet, this contains the details of
   * the card wallet.
   */
  wallet: {
    type: 'amex_express_checkout'|'apple_pay'|'google_pay'|'masterpass'|'samsung_pay'|'visa_checkout';
    amex_express_checkout?: any;
    apple_pay?: any;
    dynamic_last4?: any;
    google_pay?: any;
    masterpass?: any;
    samsung_pay?: any;
    visa_checkout?: any;
  } | null;
}

/**
 * Details about the payment method at the time of the transaction.
 */
export interface PaymentMethodDetails {
  /**
   * The type of transaction-specific details of the payment method used in the payment
   */
  type: 'ach_credit_transfer'
  | 'ach_debit'
  | 'alipay'
  | 'bancontact'
  | 'card'
  | 'eps'
  | 'giropay'
  | 'ideal'
  | 'multibanco'
  | 'p24'
  | 'sepa_debit'
  | 'sofort'
  | 'stripe_account'
  | 'wechat';

  ach_credit_transfer?: AchCreditTransferDetails | null;
  ach_debit?: AchDebitDetails | null;
  alipay?: any | null;
  bancontact?: BanContactDetails | null;
  card?: PaymentMethodCard | null;
  eps?: EpsDetails | null;
  giropay?: GiropayDetails | null;
  ideal?: IdealDetails | null;
  multibanco?: MultibancoDetails | null;
  p24?: P24Details | null;
  sepa_debit?: SepaDebitDetails | null;
  sofort?: SofortDetails | null;
  stripe_account?: any | null;
  wechat?: any | null;
}

export interface AchCreditTransferDetails {
  account_number: string;
  bank_name: string;
  routing_number: string;
  swift_coode: string;
}

export interface AchDebitDetails {
  account_holder_type: 'individual'|'company';
  bank_name: string;
  country: string;
  fingerprint: string;
  last4: string;
  routing_number: string;
}

export interface BanContactDetails {
  bank_code: string;
  bank_name: string;
  bic: string;
  iban_last4: string;
  preferred_language: 'en' | 'de' | 'fr' | 'nl';
  verified_name: string;
}

export interface EpsDetails {
  verified_name: string;
}

export interface GiropayDetails {
  bank_code: string;
  bank_name: string;
  bic: string;
  verified_name: string;
}

export interface IdealDetails {
  bank: 'abn_amro'
  | 'asn_bank'
  | 'bunq'
  | 'handelsbanken'
  | 'ing'
  | 'knab'
  | 'moneyou'
  | 'rabobank'
  | 'regiobank'
  | 'sns_bank'
  | 'triodos_bank'
  | 'van_lanschot';

  bic: string;
  iban_last4: string;
  verified_name: string;
}

export interface MultibancoDetails {
  entity: string;
  reference: string;
}

export interface P24Details {
  reference: string;
  verified_name: string;
}

export interface SepaDebitDetails {
  bank_code: string;
  branch_code: string;
  country: string;
  fingerprint: string;
  last4: string;
}

export interface SofortDetails {
  bank_code: string;
  bank_name: string;
  bic: string;
  country: string;
  iban_last4: string;
  verified_name: string;
}

/**
 * @see https://stripe.com/docs/api/payment_methods/create#create_payment_method-billing_details
 */
export interface BillingDetails {
  address?: BillingAddress | null;
  email?: string | null;
  name?: string | null;
  phone?: string | null;
}

export type BillingAddress = ShippingAddress;

export interface PaymentMethodData {

  type: PaymentMethodType;

  card?: Element<'card'|'cardNumber'>;

  ideal?: Element<'ideal'>;

  sepa_direct?: Element<'iban'>;
  /**
   * Billing information associated with the PaymentMethod
   * that may be used or required by particular types of
   * payment methods.
   */
  billing_details?: BillingDetails;
}

// --- RESPONSE FROM STRIPE WHEN CREATING OR FETCHING A PAYMENT --- //
export interface PaymentMethodResult {
  /**
   * The generated string that can be used for communication with the backend
   */
  paymentMethod?: PaymentMethod;

  /**
   * There was an error. This includes client-side validation errors.
   */
  error?: StripeError;
}