
export interface Refund {
  /**
   * Unique identifier for the object.
   */
  id: string;

  /**
   * Value is "refund"
   */
  object: 'refund';

  /**
   * Refund amount, in cents.
   */
  amount: number;

  /**
   * Balance transaction that describes the impact on your account balance.
   */
  balance_transaction: string | null;

  /**
   * ID of the charge that was refunded.
   */
  charge: string;

  /**
   * Time at which the object was created. Measured in seconds since the Unix epoch.
   */
  created: number;

  /**
   * Three-letter ISO currency code, in lowercase. Must be a supported currency.
   */
  currency: string;

  /**
   * An arbitrary string attached to the object. Often useful for
   * displaying to users. (Available on non-card refunds only)
   */
  description?: string;

  /**
   * If the refund failed, this balance transaction describes the
   * adjustment made on your account balance that reverses the
   * initial balance transaction.
   */
  failure_balance_transaction?: string;

  /**
   * If the refund failed, the reason for refund failure if known
   */
  failure_reason?: 'lost_or_stolen_card'
  | 'expired_or_canceled_card'
  | 'unknown';

  metadata: { [key:string]: string };

  /**
   * Reason for the refund
   */
  reason: 'duplicate' | 'fraudulent' | 'requested_by_customer' | null;

  /**
   * This is the transaction number that appears on email
   * receipts sent for this refund.
   */
  receipt_number: string | null;

  /**
   * The transfer reversal that is associated with the refund.
   * Only present if the charge came from another Stripe account.
   * See the Connect documentation for details.
   */
  source_transfer_reversal: string | null;

  /**
   * Status of the refund. For credit card refunds, this can be
   * pending, succeeded, or failed. For other types of refunds,
   * it can be pending, succeeded, failed, or canceled. Refer to
   * our refunds documentation for more details.
   */
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';

  /**
   * If the accompanying transfer was reversed, the transfer reversal object.
   * Only applicable if the charge was created using the destination parameter.
   */
  transfer_reversal: string | null;
}