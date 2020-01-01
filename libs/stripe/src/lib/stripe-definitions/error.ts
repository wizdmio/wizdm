import { PaymentMethod } from './payment-method';
import { Source } from './source';

export type ErrorType = 
  | 'api_connection_error'
  | 'api_error'
  | 'authentication_error'
  | 'card_error'
  | 'idempotency_error'
  | 'invalid_request_error'
  | 'rate_limit_error'
  | 'validation_error';

export interface StripeError {
  /**
   * The type of error returned.
   */
  type: ErrorType;

  /**
   * For card errors, the ID of the failed charge.
   */
  charge: string;

  /**
   * For some errors that could be handled programmatically,
   * a short string indicating the error code reported.
   */
  code?: string;

  /**
   * For card errors resulting from a card issuer decline,
   * a short string indicating the card issuer’s reason for
   * the decline if they provide one.
   */
  decline_code?: string;

  /**
   * A URL to more information about the error code reported.
   */
  doc_url?: string;

  /**
   * A human-readable message providing more details about the
   * error. For card errors, these messages can be shown to
   * your users.
   */
  message?: string;

  /**
   * If the error is parameter-specific, the parameter related
   * to the error. For example, you can use this to display a
   * message near the correct form field.
   */
  param?: string;

  /**
   * The PaymentIntent object for errors returned on a request
   * involving a PaymentIntent.
   */
  //payment_intent?: PaymentIntent;

  /**
   * The PaymentMethod object for errors returned on a
   * request involving a PaymentMethod.
   */
  payment_method?: PaymentMethod;

  /**
   * The source object for errors returned on a request involving
   * a source.
   */
  source?: Source;
}
