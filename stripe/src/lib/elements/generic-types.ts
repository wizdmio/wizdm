import type { 
  StripeElementType, 
  StripeAuBankAccountElement, 
  StripeCardElement, 
  StripeCardNumberElement, 
  StripeCardExpiryElement, 
  StripeCardCvcElement, 
  StripeIbanElement, 
  StripeIdealBankElement, 
  StripeFpxBankElement,
  StripePaymentRequestButtonElement
} from '@stripe/stripe-js';

/** Generic StripeElement */
export type StripeElement<T extends StripeElementType> =
  T extends 'auBankAccount'        ? StripeAuBankAccountElement : 
  T extends 'card'                 ? StripeCardElement :
  T extends 'cardNumber'           ? StripeCardNumberElement :
  T extends 'cardExpiry'           ? StripeCardExpiryElement :
  T extends 'cardCvc'              ? StripeCardCvcElement :
  T extends 'fpxBank'              ? StripeFpxBankElement : 
  T extends 'iban'                 ? StripeIbanElement :
  T extends 'idealBank'            ? StripeIdealBankElement : 
  T extends 'paymentRequestButton' ? StripePaymentRequestButtonElement :
    never;

import type { 
  StripeAuBankAccountElementOptions, 
  StripeCardElementOptions, 
  StripeCardNumberElementOptions, 
  StripeCardExpiryElementOptions, 
  StripeCardCvcElementOptions, 
  StripeIbanElementOptions, 
  StripeIdealBankElementOptions, 
  StripeFpxBankElementOptions,
  StripePaymentRequestButtonElementOptions
} from '@stripe/stripe-js';

/** Generic StripeElementOptions */
export type StripeElementOptions<T extends StripeElementType> =
  T extends 'auBankAccount'        ? StripeAuBankAccountElementOptions : 
  T extends 'card'                 ? StripeCardElementOptions :
  T extends 'cardNumber'           ? StripeCardNumberElementOptions :
  T extends 'cardExpiry'           ? StripeCardExpiryElementOptions :
  T extends 'cardCvc'              ? StripeCardCvcElementOptions :
  T extends 'fpxBank'              ? StripeFpxBankElementOptions : 
  T extends 'iban'                 ? StripeIbanElementOptions :
  T extends 'idealBank'            ? StripeIdealBankElementOptions : 
  T extends 'paymentRequestButton' ? StripePaymentRequestButtonElementOptions :
    never;

import type { 
  StripeAuBankAccountElementChangeEvent, 
  StripeCardElementChangeEvent, 
  StripeCardNumberElementChangeEvent, 
  StripeCardExpiryElementChangeEvent, 
  StripeCardCvcElementChangeEvent, 
  StripeIbanElementChangeEvent, 
  StripeIdealBankElementChangeEvent, 
  StripeFpxBankElementChangeEvent,
  StripePaymentRequestButtonElementClickEvent
} from '@stripe/stripe-js';

/** Generic StripeElementChangeEvent */
export type StripeElementChangeEvent<T extends StripeElementType> = 
  T extends 'auBankAccount'        ? StripeAuBankAccountElementChangeEvent : 
  T extends 'card'                 ? StripeCardElementChangeEvent :
  T extends 'cardNumber'           ? StripeCardNumberElementChangeEvent :
  T extends 'cardExpiry'           ? StripeCardExpiryElementChangeEvent :
  T extends 'cardCvc'              ? StripeCardCvcElementChangeEvent :
  T extends 'fpxBank'              ? StripeFpxBankElementChangeEvent :
  T extends 'iban'                 ? StripeIbanElementChangeEvent :
  T extends 'idealBank'            ? StripeIdealBankElementChangeEvent :
  T extends 'paymentRequestButton' ? undefined :
    never;
