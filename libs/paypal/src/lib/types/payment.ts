import { Money, TaxInfo, PartyName, AddressPortable, LinkDescription } from './common';

export type AuthorizationStatus = 'CREATED'|'CAPTURED'|'DENIED'|'EXPIRED'|'PARTIALLY_CAPTURED'|'VOIDED'|'PENDING';

export interface PaymentRequest {
  invoice_id?: string;
  note_to_payer?: string;
  amount?: Money;
  final_capture: boolean;
  payment_instruction: PaymentInstruction;
}

export interface PaymentResponse {
  status: AuthorizationStatus;
  status_details: AuthorizationStatusDetails;
  id: string,
  amonut: Money;
  invoice_id: string;
  custom_id: string;
  sellet_protectoion: any;
  expiration_time: string;
  links: LinkDescription[];
  create_time: string;
  update_time: string;
}

export interface Payee {
  email_address?: string;
  merchant_id?: string;
}

export interface Payer {
  name?: PartyName;
  email_address?: string;
  payer_id?: string;
  birth_date?: string;
  tax_info?: TaxInfo;
  address?: AddressPortable;
}

export interface PaymentInstruction {
  platform_fees?: PlatformFee[];
  disbursement_mode?: DisbursementMode;
}

export type DisbursementMode = 'INSTANT' | 'DELAYED';

export interface PlatformFee {
    amount: Money;
    payee?: Payee;
}

export interface AuthorizationStatusDetails {
  reason: 'PENDING_REVIEW';
}

export interface LastPaymentDetails {
  amount: Money;
  time: string;
}