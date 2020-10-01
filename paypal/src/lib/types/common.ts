export type Funding = 'paypal'|'venmo'|'itau'|'credit'|'paylater'|'card'|'ideal'|'sepa'|'bancontact'|'giropay'|'sofort'|'eps'|'mybank'|'p24'|'vekkopankki'|'payu'|'blik'|'trustly'|'zimpler'|'maxima'|'oxxo'|'boleto'|'wechatpay'|'mercadopago';
export type Currency = |'AUD'|'BRL'|'CAD'|'CZK'|'DKK'|'EUR'|'HKD'|'HUF'|'INR'|'ILS'|'JPY'|'MYR'|'MXN'|'TWD'|'NZD'|'NOK'|'PHP'|'PLN'|'GBP'|'RUB'|'SGD'|'SEK'|'CHF'|'THB'|'USD';
export type Card = 'visa'|'mastercard'|'amex'|'discover'|'jcb'|'elo'|'hiper';

export interface LocaleType {
  country: string;
  lang: string;
}

export interface Money {
  currency_code: Currency;
  value: string;
}

export interface TaxInfo {
  tax_id: string;
  tax_id_type: TaxIdType;
}

export type TaxIdType = 'BR_CPF'|'BR_CNPJ';

export interface LinkDescription {
  href: string;
  rel: String;
  method?: LinkMethod;
}

export type LinkMethod = 'GET'|'POST'|'PUT'|'DELETE'|'HEAD'|'CONNECT'|'OPTIONS'|'PATCH';

export interface Shipping {
  name?: PartyName;
  address?: AddressPortable;
}

export interface PartyName {
  prefix?: string;
  given_name?: string;
  surname?: string;
  middle_name?: string;
  suffix?: string;
  alternate_full_name?: string;
  full_name?: string;
}

export interface AddressPortable {
  country_code: string;
  address_line_1?: string;
  address_line_2?: string;
  admin_area_2?: string;
  admin_area_1?: string;
  postal_code?: string;
}

export interface ApplicationContext {
  brand_name?: string;
  locale?: string;
  landing_page?: LandingPage;
  shipping_preference?: ShippingPreference;
  user_action?: UserAction;
  payment_method?: PaymentMethod;
  return_url?: string;
  cancel_url?: string;
}

export type LandingPage = 'LOGIN' | 'BILLING';
export type ShippingPreference = 'GET_FROM_FILE' | 'NO_SHIPPING' | 'SET_PROVIDED_ADDRESS';
export type UserAction = 'CONTINUE' | 'PAY_NOW';

export interface PaymentMethod {
  payer_selected?: PayerSelected;
  payee_preferred?: PayeePreferred;
}

export type PayerSelected = 'PAYPAL_CREDIT' | 'PAYPAL';
export type PayeePreferred = 'UNRESTRICTED' | 'IMMEDIATE_PAYMENT_REQUIRED';
/*
export interface Phone {
  phone_type?: PhoneType;
  phone_number?: PhoneNumber;
}

export type PhoneType = 'FAX'|'HOME'|'MOBILE'|'OTHER'|'PAGER';

export interface PhoneNumber {
  national_number: string;
}
*/