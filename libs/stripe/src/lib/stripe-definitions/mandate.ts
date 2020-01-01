
export interface Mandate {

  acceptance?: {
    /**
     * The unix timestamp the mandate was accepted or refused at by the customer.
     */
    date: number;

    /**
     * The unix timestamp the mandate was accepted or refused at by the customer.
     */
    ip: string;

    /**
     * The status of the mandate acceptance
     */
    status: 'accepted' | 'refused';

    /**
     * The user agent of the browser from which the mandate was accepted or refused by the customer
     * NOTE: This can be unset by updating the value to `null` and then saving
     */
    user_agent: string;
  };

  /**
   * The method Stripe should use to notify the customer
   * - email: an email is sent directly to the customer
   * - manual: a source.mandate_notification event is sent to your webhooks endpoint and you should handle the notification
   * - none: the underlying debit network does not require any notification
   */
  notification_method?: 'email' | 'manual' | 'none';
}
