/**
 * @see https://stripe.com/docs/api#customer_bank_account_object
 */
export interface BankAccount {
  /**
   * The unique identifier of the bank account
   */
  id: string;

  object: 'bank_account';

  /**
   * The name of the person or business that owns the bank account.
   */
  account_holder_name: string;

  /**
   * The type of entity that holds the account.
   */
  account_holder_type: 'individual' | 'company';

  /**
   * Name of the bank associated with the routing number
   * @example 'STRIPE TEST BANK'
   */
  bank_name: string;

  /**
   * The routing transit number for the bank account
   */
  routing_number: string;

  /**
   * Two-letter ISO code representing the country the bank account is located in
   * @example 'US'
   */
  country: string;
  /**
   * Three-letter ISO code for the currency paid out to the bank account
   * @example 'usd'
   */
  currency: string;

  customer: string;

  /**
   * Uniquely identifies this particular bank account.
   * NOTE: You can use this attribute to check whether two bank accounts are the same
   */
  fingerprint: string;

  /**
   * The last 4 digits of the bank number
   */
  last4: string;

  /**
   * Your own saved information with this bank account
   */
  metadata: { [key: string]: string };

  /**
   * The status of the bank account
   * @see https://stripe.com/docs/api#customer_bank_account_object-status
   */
  status: 'new' | 'validated' | 'verified' | 'verification_failed' | 'errored';
}