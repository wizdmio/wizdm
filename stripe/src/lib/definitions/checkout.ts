import { StripeError } from "./error";

export type CheckoutOptions = ClientSkuCheckoutOptions | ClientPlanCheckoutOptions | ServerCheckoutOptions;

export type CheckoutResult = never | {
  error: StripeError;
};

export interface ClientSkuCheckoutOptions extends ClientPlanCheckoutOptions<SkuCheckoutItem> {
  submitType?: 'auto'|'book'|'donate'|'pay';
}

export interface ClientPlanCheckoutOptions<Item extends CheckoutItem = PlanCheckoutItem> {
  successUrl: string;
  cancelUrl: string;
  items: Item[];
  clientReferenceId?: string;
  customerEmail?: string;
  billingAddressCollection?: 'required'|'auto'|undefined;
  locale?: string;
}

export interface ServerCheckoutOptions {
  sessionId: string;
}

export type CheckoutItem = SkuCheckoutItem | PlanCheckoutItem;

export interface SkuCheckoutItem {
  sku: string;
  quantity: number;
}

export interface PlanCheckoutItem {
  plan: string;
}