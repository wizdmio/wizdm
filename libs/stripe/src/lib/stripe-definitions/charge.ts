import { PaymentMethodDetails, ShippingDetails, BillingDetails } from './payment-method';
import { Refund } from './refund';
import { Source } from './source';
import { List } from './list';

export interface Charge {
  /**
   * Unique identifier for the object.
   */
  id: string;

  /**
   * Value is 'charge'
   */
  object: "charge";

  /**
   * Amount charged in cents/pence, positive integer or zero.
   */
  amount: number;

  /**
   * Amount in cents/pence refunded (can be less than the amount attribute on the
   * charge if a partial refund was issued), positive integer or zero.
   */
  amount_refunded: number;

  /**
   * ID of the Connect application that created the charge.
   */
  application: string | null;

  /**
   * The application fee (if any) for the charge. See the Connect documentation
   * for details.
   */
  application_fee: string | null;

  /**
   * The amount of the application fee (if any) for the charge. See the Connect
   * documentation for details.
   */
  application_fee_amount: number | null;

  /**
   * ID of the balance transaction that describes the impact of this charge on
   * your account balance (not including refunds or disputes).
   */
  balance_transaction: string;

  /**
   * Billing information associated with the payment method at the time of the transaction.
   */
  billing_details: BillingDetails;

  /**
   * If the charge was created without capturing, this boolean represents whether or not it is
   * still uncaptured or has since been captured.
   */
  captured: boolean;

  /**
   * Time at which the object was created. Measured in seconds since the Unix epoch.
   */
  created: number;

  /**
   * Three-letter ISO currency code representing the currency in which the
   * charge was made.
   */
  currency: string;

  /**
   * ID of the customer this charge is for if one exists.
   */
  customer: string | null;

  /**
   * An arbitrary string attached to the object. Often useful for displaying to users.
   */
  description: string | null;

  /**
   * Details about the dispute if the charge has been disputed.
   */
  dispute: string | null;

  /**
   * Error code explaining reason for charge failure if available (see the errors section for a list of
   * codes: https://stripe.com/docs/api#errors).
   */
  failure_code: string | null;

  /**
   * Message to user further explaining reason for charge failure if available.
   */
  failure_message: string | null;

  /**
   * Hash with information on fraud assessments for the charge.
   */
  fraud_details: {
    /**
     * Assessments reported by you have the key user_report and, if set, possible values of "safe" and "fraudulent".
     */
    user_report?: "fraudulent" | "safe";

    /**
     * Assessments from Stripe have the key stripe_report and, if set, the value "fraudulent".
     */
    stripe_report?: "fraudulent";
  };

  /**
   * ID of the invoice this charge is for if one exists. [Expandable]
   */
  invoice: string | null;

  /**
   * Has the value true if the object exists in live mode or the value false if
   * the object exists in test mode.
   */
  livemode: boolean;

  metadata: { [key: string]: string };

  /**
   * The Stripe account ID for which these funds are intended. Automatically
   * set if you use the destination parameter. For details, see [Creating
   * Separate Charges and Transfers]
   * <https://stripe.com/docs/connect/charges-transfers#on-behalf-of>.
   */
  on_behalf_of: string | null;

  /**
   * ID of the order this charge is for if one exists.
   */
  order: string | null;

  /**
   * Details about whether the payment was accepted, and why. See
   * understanding declines for details.
   */
  outcome: {
    network_status: 'approved_by_network' | 'declined_by_network' | 'not_sent_to_network' | 'reversed_after_approval';
    reason: 'highest_risk_level' | 'elevated_risk_level' | 'rule' | null;
    risk_level: 'normal' | 'elevated' | 'highest' | 'not_assessed' | 'unknown';
    risk_score: number;
    rule?: string;
    seller_message: string;
    type: 'authorized' | 'manual_review' | 'issuer_declined' | 'blocked' | 'invalid';
  } | null;

  /**
   * true if the charge succeeded, or was successfully authorized for later capture.
   */
  paid: boolean;

  /**
   * ID of the PaymentIntent associated with this charge, if one exists.
   */
  payment_intent: string;

  /**
   * ID of the payment method used in this charge.
   */
  payment_method: string | null;

  payment_method_details: PaymentMethodDetails;

  /**
   * This is the email address that the receipt for this charge was sent to.
   */
  receipt_email: string | null;

  /**
   * This is the transaction number that appears on email receipts sent for this charge.
   */
  receipt_number: string | null;

  /**
   * This is the URL to view the receipt for this charge. The receipt is kept up-to-date to the
   * latest state of the charge, including any refunds. If the charge is for an Invoice, the
   * receipt will be stylized as an Invoice receipt.
   */
  receipt_url: string;

  /**
   * Whether or not the charge has been fully refunded. If the charge is only partially refunded,
   * this attribute will still be false.
   */
  refunded: boolean;

  /**
   * A list of refunds that have been applied to the charge.
   */
  refunds: List<Refund>;

  /**
   * ID of the review associated with this charge if one exists.
   */
  review?: string | null;

  /**
   * Shipping information for the charge.
   */
  shipping?: ShippingDetails | null;

  /**
   * For most Stripe users, the source of every charge is a credit or debit card.
   * This hash is then the card object describing that card.
   */
  source?: Source;

  /**
   * The transfer ID which created this charge. Only present if the charge came
   * from another Stripe account. See the Connect documentation for details.
   */
  source_transfer: string | null;

  /**
   * Extra information about a charge. This will appear on your customer’s
   * credit card statement.
   */
  statement_descriptor: string | null;

  /**
   * The status of the payment is either "succeeded", "pending", or "failed".
   */
  status: "succeeded" | "pending" | "failed";

  /**
   * ID of the transfer to the destination account (only applicable if the
   * charge was created using the destination parameter).
   */
  transfer?: string | null;

  /**
   * A string that identifies this transaction as part of a group.
   * See the Connect documentation for details.
   */
  transfer_group?: string | null;
}
