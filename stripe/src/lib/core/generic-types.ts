import type { StripeAuBankAccountElementChangeEvent, StripeCardElementChangeEvent, StripeCardNumberElementChangeEvent, StripeCardExpiryElementChangeEvent, StripeCardCvcElementChangeEvent, StripeIbanElementChangeEvent, StripeIdealBankElementChangeEvent, StripeFpxBankElementChangeEvent } from '@stripe/stripe-js';
import type { StripeAuBankAccountElementOptions, StripeCardElementOptions, StripeCardNumberElementOptions, StripeCardExpiryElementOptions, StripeCardCvcElementOptions, StripeIbanElementOptions, StripeIdealBankElementOptions, StripeFpxBankElementOptions } from '@stripe/stripe-js';
import type { StripeElementType, StripeAuBankAccountElement, StripeCardElement, StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement, StripeIbanElement, StripeIdealBankElement, StripeFpxBankElement } from '@stripe/stripe-js';

/** Supported StripeElement types */
export type SupportedStripeElementType = Exclude<StripeElementType, 'auBankAccount'|'paymentRequestButton'>;

/** Generic StripeElement */
export type StripeElement<T extends SupportedStripeElementType> =
  //T extends 'auBankAccount'        ? StripeAuBankAccountElement : 
  T extends 'card'                 ? StripeCardElement :
  T extends 'cardNumber'           ? StripeCardNumberElement :
  T extends 'cardExpiry'           ? StripeCardExpiryElement :
  T extends 'cardCvc'              ? StripeCardCvcElement :
  T extends 'fpxBank'              ? StripeFpxBankElement : 
  T extends 'iban'                 ? StripeIbanElement :
  T extends 'idealBank'            ? StripeIdealBankElement : 
    never;

/** Generic StripeElementOptions */
export type StripeElementOptions<T extends SupportedStripeElementType> =
  //T extends 'auBankAccount'        ? StripeAuBankAccountElementOptions : 
  T extends 'card'                 ? StripeCardElementOptions :
  T extends 'cardNumber'           ? StripeCardNumberElementOptions :
  T extends 'cardExpiry'           ? StripeCardExpiryElementOptions :
  T extends 'cardCvc'              ? StripeCardCvcElementOptions :
  T extends 'fpxBank'              ? StripeFpxBankElementOptions : 
  T extends 'iban'                 ? StripeIbanElementOptions :
  T extends 'idealBank'            ? StripeIdealBankElementOptions : 
    never;

/** Generic StripeElementChangeEvent */
export type StripeChangeEventObject<T extends SupportedStripeElementType> = 
  //T extends 'auBankAccount'        ? StripeAuBankAccountElementChangeEvent : 
  T extends 'card'                 ? StripeCardElementChangeEvent :
  T extends 'cardNumber'           ? StripeCardNumberElementChangeEvent :
  T extends 'cardExpiry'           ? StripeCardExpiryElementChangeEvent :
  T extends 'cardCvc'              ? StripeCardCvcElementChangeEvent :
  T extends 'fpxBank'              ? StripeFpxBankElementChangeEvent :
  T extends 'iban'                 ? StripeIbanElementChangeEvent :
  T extends 'idealBank'            ? StripeIdealBankElementChangeEvent : 
    never;