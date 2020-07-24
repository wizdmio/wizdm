import { PaymentIntentData, CardPaymentIntentData, IdealPaymentIntentData, IbanPaymentIntentData, PaymentIntentOptions, PaymentIntentResult } from './payment-intent';
import { TokenData, BankTokenData, PiiTokenData, IbanTokenData, TokenResult } from './token';
import { PaymentMethodData, PaymentMethodResult } from './payment-method';
import { Elements, ElementsOptions, Element } from './element';
import { CheckoutOptions, CheckoutResult } from './checkout';
import { SourceData, SourceResult } from './source';

export interface StripeOptions {
  /**
   * For usage with Connect only. 
   * Specifying a connected account ID (e.g., acct_24BFMpJ1svR5A89k) allows you to perform actions on behalf of that account.
   */
  stripeAccount?: string;
  /**
   * The IETF language tag used to globally configure localization in Stripe.js. 
   * Setting the locale here will localize error strings for all Stripe.js methods. 
   * It will also configure the locale for Elements and Checkout. 
   * @default 'auto' (Stripe detects the locale of the browser).
   * Supported values depend on which features you are using. 
   * Checkout supports a slightly different set of locales than the rest of Stripe.js. 
   * If you are planning on using Checkout, make sure to use a value that it supports.
   */
  locale?: 'auto'|string;
}

export interface StripeJS {
   /**
   * Initialization function for StripeJS
   * @see https://stripe.com/docs/js/initializing
   * @param key - The public key of the user
   * @param [options] - Any options to configure StripeJS
   * @return StripeJS instance
   */
  (publicKey: string, options?: StripeOptions): Stripe;

  /** StripeJS version number */
  version: number;
}

export abstract class Stripe {
  /**
   * Create an instance of elements which can be used to manage a group of StripeJS elements
   * @see https://stripe.com/docs/js/elements_object
   * @param [options] - Configuration options for the elements object
   * @return an instance of `Elements` to manage a group of elements
   */
  abstract elements(options?: ElementsOptions): Elements;

  /**
   * to redirect your customers to Checkout, a Stripe-hosted page to securely collect payment information. 
   * When the customer completes their purchase, they are redirected back to your website.
   * @see https://stripe.com/docs/js/checkout/redirect_to_checkout
   * @param options - Configuration options for the redirection 
   * @return a Promise which resolves with a result object. 
   * If this method fails, the result object will contain a localized error message in the error.message field.
   */
  abstract redirectToCheckout(options?: CheckoutOptions): Promise<CheckoutResult>;

  /** -- TOKEN & SOURCES ------ 
   * The Charges API is the fastest way to accept U.S. and Canadian payments for your startup or prototype. 
   * Stripe.js provides the following methods to create Tokens and Sources, which are part of the Charges API.
   * To accept payments globally, use the Payment Intents API instead.
   * @see https://stripe.com/docs/js/tokens_sources
   * To convert information collected by Elements into a single-use token that you safely pass to your server
   * to use in an API call
   * @param element - The element from which the data should be extracted
   * @param [data] - an object containing additional payment information you might have collected
   * @return an object containing the generated token or an error
   */
  abstract createToken(element: Element<'card'|'cardNumber'|'cardCvc'>, data?: TokenData): Promise<TokenResult>;
  abstract createToken(element: Element<'iban'>, data?: IbanTokenData): Promise<TokenResult>;
  abstract createToken(type: 'bank_account', data?: BankTokenData): Promise<TokenResult>;
  abstract createToken(type: 'pii', data?: PiiTokenData): Promise<TokenResult>;

  /**
   * Convert payment information collected by Elements into a Source object that you safely pass to your server to use in an API call
   * NOTE: You cannot pass raw card information without an `Element`!
   * @see https://stripe.com/docs/js/tokens_sources/create_source
   * @param element - The element from which information should be extracted
   * @param data - An object containing the type of Source you want to create and any additional payment source information
   * @return an object containing the generated Source or an error
   */
  abstract createSource(element: Element<'card'|'cardNumber'|'cardCvc'|'iban'>, sourceData?: SourceData): Promise<SourceResult>;
  abstract createSource(options: SourceData): Promise<SourceResult>;

  /**
   * Retrieve a Source using its unique ID and client secret.
   * @see https://stripe.com/docs/js/tokens_sources/retrieve_source
   * @param id - Unique identifier of the source
   * @param client_secret - A secret available to the web client that created the Source
   * @return an object containing the generated Source or an error
   */
  abstract retrieveSource({ id, client_secret }: { id: string, client_secret: string }): Promise<SourceResult>;

  /** -- PAYMENT INTENTS ------ 
   * Accept global payments online with the Payment Intents APIs. 
   * For step-by-step instructions on using the Payment Intents APIs, see the accept a payment guide.
   * The following Stripe.js methods are available to use as part of your integration.
   * @see https://stripe.com/docs/js/payment_intents
   * Use when the customer submits your payment form. 
   * When called, it will confirm the PaymentIntent with data you provide and carry out 3DS or other next actions if they are required.
   * @see https://stripe.com/docs/js/payment_intents/confirm_card_payment
   * @param client_secret - A secret available to the web client that created the PaymentIntent
   * @param data Data to be sent with the request.
   * @param options An options object to control the behavior of this method.
   * @return an object containing the generated PaymentIntent or an error
   */
  abstract confirmCardPayment(clientSecret: string, data?: PaymentIntentData, options?: PaymentIntentOptions): Promise<PaymentIntentResult>;

  /**
   * Use with payment data from an Element by passing a card or cardNumber Element.
   * The new PaymentMethod will be created with data collected by the Element and will be used to confirm the PaymentIntent.
   * @param client_secret - A secret available to the web client that created the PaymentIntent
   * @param data an object to confirm using data collected by a card or cardNumber Element.
   * @param options An options object to control the behavior of this method.
   * @return an object containing the generated PaymentIntent or an error
   */
  abstract confirmCardPayment(clientSecret: string, data?: CardPaymentIntentData, options?: PaymentIntentOptions): Promise<PaymentIntentResult>;

  /** Use in the iDEAL Payments with Payment Methods flow when the customer submits your payment form. 
   *  When called, it will confirm the PaymentIntent with data you provide, and it will automatically redirect the customer to the authorize the transaction. 
   * Once authorization is complete, the customer will be redirected back to your specified return_url.
   * @see https://stripe.com/docs/js/payment_intents/confirm_ideal_payment
   * @param client_secret - A secret available to the web client that created the PaymentIntent
   * @param data Data to be sent with the request.
   * @param options An options object to control the behavior of this method.
   * @return an object containing the generated PaymentIntent or an error
   */
  abstract confirmIdealPayment(clientSecret: string, data?: PaymentIntentData, options?: PaymentIntentOptions): Promise<PaymentIntentResult>;

  /**
   * Create and attach a new PaymentMethod by passing an idealBank Element. 
   * The new PaymentMethod will be created with the bank code collected by the Element and will be used to confirm the PaymentIntent.
   * @param client_secret - A secret available to the web client that created the PaymentIntent
   * @param data Pass an object to confirm using data collected by an idealBank Element.
   * @param options An options object to control the behavior of this method.
   * @return an object containing the generated PaymentIntent or an error
   */
  abstract confirmIdealPayment(clientSecret: string, data?: IdealPaymentIntentData, options?: PaymentIntentOptions): Promise<PaymentIntentResult>;

  /**
   * Use in the SEPA Direct Debit Payments with Payment Methods flow when the customer submits your payment form. 
   * When called, it will confirm the PaymentIntent with data you provide.
   * https://stripe.com/docs/js/payment_intents/confirm_sepa_debit_payment
   * @param client_secret - A secret available to the web client that created the PaymentIntent
   * @param data Data to be sent with the request.
   * @return an object containing the generated PaymentIntent or an error
   */
  abstract confirmSepaDebitPayment(clientSecret: string, data?: PaymentIntentData): Promise<PaymentIntentResult>;

  /**
   * Create and attach a new PaymentMethod by passing an iban Element. 
   * The new PaymentMethod will be created with the data collected by the Element and will be used to confirm the PaymentIntent. 
   * Additionally, to create a SEPA Direct Debit PaymentMethod, you are required to collect and include the customer’s name and email address.
   * @param client_secret - A secret available to the web client that created the PaymentIntent
   * @param data Pass an object to confirm the payment using data collected by an iban Element.
   * @return an object containing the generated PaymentIntent or an error
   */
  abstract confirmSepaDebitPayment(clientSecret: string, data?: IbanPaymentIntentData): Promise<PaymentIntentResult>;

  /** Use in the Payment Intents API manual confirmation flow to handle a PaymentIntent with the requires_action status. 
   * It will throw an error if the PaymentIntent has a different status.
   * @see https://stripe.com/docs/js/payment_intents/handle_card_action
   * @param client_secret - A secret available to the web client that created the PaymentIntent
   * @return an object containing the generated PaymentIntent or an error
   */
   abstract handleCardAction(clientSecret: string): Promise<PaymentIntentResult>;

  /**
   * Use to convert payment information collected by elements into a PaymentMethod object that you safely pass to your server to use in an API call.
   * @see https://stripe.com/docs/js/payment_intents/create_payment_method
   * @param data the payment method data object
   * @return an object containing the generated PaymentMethod or an error
   */
  abstract createPaymentMethod(data: PaymentMethodData): Promise<PaymentMethodResult>;

  /**
   * Retrieve a PaymentIntent using its client secret.
   * @see https://stripe.com/docs/js/payment_intents/retrieve_payment_intent
   * @param clientSecret the client secret
   * @return an object containing the retrived PaymentIntent or an error
   */
  abstract retrievePaymentIntent(clientSecret: string): Promise<PaymentIntentResult>;

  /** -- SETUP INTENTS ------
   * Use the Setup Intents APIs to save a card and charge it later. 
   * @see https://stripe.com/docs/js/setup_intents
   * Use in the Setup Intents API flow when the customer submits your payment form. 
   * When called, it will confirm the SetupIntent with data you provide and carry out 3DS or other next actions if they are required.
   * @see https://stripe.com/docs/js/setup_intents/confirm_card_setup
   * @param client_secret - A secret available to the web client that created the PaymentIntent
   * @param data Data to be sent with the request.
   * @param options An options object to control the behavior of this method.
   * @return an object containing the generated PaymentIntent or an error
   */
  abstract confirmCardSetup(clientSecret: string, data?: PaymentIntentData, options?: PaymentIntentOptions): Promise<PaymentIntentResult>;

  /**
   * Use with payment data from an Element by passing a card or cardNumber Element. 
   * The new PaymentMethod will be created with data collected by the Element and will be used to confirm the SetupIntent.
   * @param client_secret - A secret available to the web client that created the PaymentIntent
   * @param data an object to confirm using data collected by a card or cardNumber Element.
   * @param options An options object to control the behavior of this method.
   * @return an object containing the generated PaymentIntent or an error
   */
  abstract confirmCardSetup(clientSecret: string, data?: CardPaymentIntentData, options?: PaymentIntentOptions): Promise<PaymentIntentResult>;

  /** 
   * Use in the SEPA Direct Debit with Setup Intents flow when the customer submits your payment form. 
   * When called, it will confirm the SetupIntent with data you provide.
   * @see https://stripe.com/docs/js/setup_intents/confirm_sepa_debit_setup
   * @param client_secret - A secret available to the web client that created the PaymentIntent
   * @param data Data to be sent with the request.
   * @return an object containing the generated PaymentIntent or an error
   */
  abstract confirmSepaDebitSetup(clientSecret: string, data?: PaymentIntentData): Promise<PaymentIntentResult>;

  /**
   * Create and attach a new PaymentMethod by passing an iban Element. 
   * The new PaymentMethod will be created with the data collected by the Element and will be used to confirm the SetupIntent.
   * @param client_secret - A secret available to the web client that created the PaymentIntent
   * @param data Pass an object to confirm the payment using data collected by an iban Element.
   * @return an object containing the generated PaymentIntent or an error
   */
  abstract confirmSepaDebitSetup(clientSecret: string, data?: IbanPaymentIntentData): Promise<PaymentIntentResult>;

  /** 
   * Retrieve a SetupIntent using its client secret.
   * @see https://stripe.com/docs/js/setup_intents/retrieve_setup_intent
   * @param client_secret - A secret available to the web client that created the PaymentIntent
   * @return an object containing the generated PaymentIntent or an error
   */
  abstract retrieveSetupIntent(clientSecret: string): Promise<PaymentIntentResult>;

  /**
   * Create a PaymentRequest object. Creating a PaymentRequest requires that you configure it with an options object.
   * In Safari uses Apple Pay, and in other browsers it uses the Payment Request API standard.
   * @see https://stripe.com/docs/js/payment_request/createPaymentMethod
   * @param options payment request option
   * @return an object containing the generated PaymentRequest
   */
  abstract paymentRequest(options: PaymentOptions): PaymentRequest;
}