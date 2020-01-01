import { Money, TaxInfo, Shipping, PartyName, AddressPortable, ApplicationContext, LinkDescription } from './common';
import { Payer, Payee, PaymentInstruction } from './payment';

export type OrderStatus = 'APPROVED' | 'SAVED' | 'CREATED' | 'VOIDED' | 'COMPLETED';
export type OrderIntent = 'CAPTURE' | 'AUTHORIZE';

export interface OrderRequest {
  intent: OrderIntent,
  purchase_units: PurchaseUnitRequest[];
  payer?: Payer;
  application_context?: ApplicationContext;
}

export interface OrderResponse {
  create_time: string;
  update_time: string;
  id: string;
  intent: OrderIntent;
  payer: Payer;
  purchase_units: PurchaseUnitRequest[];
  status: OrderStatus;
  links: LinkDescription[];
};

export interface PurchaseUnitRequest {
  amount: AmountWithBreakdown;
  reference_id?: string;
  payee?: Payee;
  payment_instruction?: PaymentInstruction;
  description?: string;
  custom_id?: string;
  invoice_id?: string;
  soft_descriptor?: string;
  items: Item[];
  shipping?: Shipping;
}

export interface AmountWithBreakdown extends Money {
  breakdown?: AmountBreakdown;
}

export interface AmountBreakdown {
  item_total?: Money;
  shipping?: Money;
  handling?: Money;
  tax_total?: Money;
  insurance?: Money;
  shipping_discount?: Money;
  discount?: Money;
}

export interface Item {
  name: string;
  unit_amount: Money;
  tax?: Money;
  quantity: string;
  description?: string;
  sku?: string;
  category?: ItemCategory;
}

export type ItemCategory = 'DIGITAL_GOODS' | 'PHYSICAL_GOODS';
