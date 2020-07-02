import { Money, PartyName, Shipping, LinkDescription, ApplicationContext } from './common';
import { LastPaymentDetails } from './payment';

export type SubscriptionStatus = 'APPROVAL_PENDING'|'APPROVED'|'ACTIVE'|'SUSPENDED'|'CANCELLED'|'EXPIRED';

export interface SubscriptionRequest {
  plan_id: string;
  start_time?: string;
  quantity?: string;
  shipping_amount?: Money;
  auto_renewal?: boolean;
  application_context?: ApplicationContext;
}

export interface SubscriptionResponse {
  status: SubscriptionStatus;
  status_change_note: string;
  status_update_time: string;
  id: string;
  plan_id: string;
  start_time: string;
  quantity: string;
  shipping_amount: Money;
  subscriber: Subscriber;
  billing_info: SubscriptionBillingInfo;
  create_time: string;
  update_time: string;
  links: LinkDescription[];
};

export interface Subscriber {
  name: PartyName;
  email_address: string;
  shipping_address: Shipping;
}

export interface SubscriptionBillingInfo {
  outstanding_balance: Money;
  last_payment?: LastPaymentDetails;
  next_billing_time?: string;
  final_payment_time?: string;
  failed_payments_count: number;
}
