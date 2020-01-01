/**
 * @see https://stripe.com/docs/api#card_object
 */
export interface Card {
  /**
   * The unique identifier of the bank account
   */
  id: string;

  /**
   * The account this card belongs to.
   * NOTE: This attribute will not be in the card object if the card belongs to a customer or recipient instead.
   */
  object: 'card';

  account?: string;

  /**
   * City/District/Suburb/Town/Village
   */
  address_city: string;

  /**
   * The country in which the address is located
   */
  address_country: string;

  /**
   * Address line 1 (Street address/PO Box/Company name)
   */
  address_line1: string;

  /**
   * The results of address_line1 if it was provided
   */
  address_line1_check: CheckStatus;

  /**
   * Address line 2 (Apartment/Suite/Unit/Building)
   */
  address_line2: string;

  /**
   * State/County/Province/Region.
   */
  address_state: string;

  /**
   * ZIP or postal code
   */
  address_zip: string;

  /**
   * The results of address_zip if it was provided
   */
  address_zip_check: CheckStatus;

  /**
   * A set of available payout methods for this card
   * NOTE: Only values from this set should be passed as the method when creating a transfer
   */
  available_payout_methods: ['standard'] | ['standard', 'instant'];

  /**
   * The brand of the card
   */
  brand: 'American Express' | 'Diners Club' | 'Discover' | 'JCB' | 'MasterCard' | 'UnionPay' | 'Visa' | 'Unknown';

  /**
   * Two-letter ISO code representing the country of the card
   * You could use this attribute to get a sense of the international breakdown of cards you’ve collected
   */
  country: string;

  /**
   * Three-letter ISO code for currency
   * Only applicable on accounts (not customers or recipients).
   * The card can be used as a transfer destination for funds in this currency
   */
  currency?: string;

  /**
   * The customer that this card belongs to
   * NOTE: This attribute will not be in the card object if the card belongs to an account or recipient instead
   */
  customer?: any;

  /**
   * If a CVC was provided, results of the check
   */
  cvc_check: CheckStatus;

  /**
   * Only applicable on accounts (not customers or recipients)
   * This indicates whether this card is the default external account for its currency
   */
  default_for_currency?: boolean;

  /**
   * The last four digits of the device account number.
   * NOTE: For tokenized numbers only
   */
  dynamic_last4: string;

  /**
   * Two-digit number representing the card’s expiration month
   */
  exp_month: number;

  /**
   * Four-digit number representing the card’s expiration year
   */
  exp_year: number;

  /**
   * Uniquely identifies this particular card number
   */
  fingerprint: string;

  /**
   * Card funding type
   */
  funding: 'credit' | 'debit' | 'prepaid' | 'unknown';

  /**
   * The last four digits of the card
   */
  last4: string;

  /**
   * The name of the cardholder
   */
  name: string;

  /**
   * The recipient that this card belongs to.
   * NOTE: This attribute will not be in the card object if the card belongs to a customer or account instead
   */
  recipient?: string;

  /**
   * If the card number is tokenized, this is the method that was used
   */
  tokenization_method: 'apple_pay' | 'android_pay';

  /**
   * Your own saved information with this card
   */
  metadata: { [key: string]: string };
}

export type CheckStatus = 'pass' | 'fail' | 'unavailable' | 'unchecked';
