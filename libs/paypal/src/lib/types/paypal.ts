import { Currency, Funding, Card } from './common';
import { ButtonsConfig, Buttons } from './buttons';
import { OrderIntent } from './order';

export abstract class PayPal {
  
  abstract Buttons(config: ButtonsConfig): Buttons;
  abstract version: string
}

// @see { https://developer.paypal.com/docs/checkout/reference/customize-sdk/#query-parameters }
export interface PayPalConfig {

  /** This identifies your PayPal account, and determines where any transactions are paid to. While you're testing in sandbox, you can use 'sb' as a shortcut. */
  clientId: string;

  /** The merchant for whom you are facilitating a transaction. */
  merchantId?: string;

  /** The currency of the transaction or subscription plan. */
  currency?: Currency;

  /** The intent of the PayPal order. Determines whether the funds are captured after the buyer checks out, or if the buyer authorizes the funds to be captured later. Not applicable for subscriptions. */
  intent?: OrderIntent;

  /** Set to true if the transaction is Pay Now, or false if the amount captured changes after the buyer returns to your site. Not applicable for subscriptions. */
  commit?: boolean;

  /** Set to true if the transaction sets up a billing agreement or subscription. */
  vault?: boolean;

  /** A comma-separated list of components to enable. Defaults to allow Smart Payment Buttons. Other components are optional. */
  components?: 'buttons'|'marks';

  /** Funding sources to disallow from showing in the Smart Payment Buttons. */
  disableFunding?: Funding;

  /** Cards to disable from showing in the Smart Payment Buttons. */
  disableCard?: Card;

  /** The date of integration. Used to ensure backwards compatibility. */
  integrationDate?: string;

  /** Enable debug mode for ease of debugging. Do not enable for production traffic. */
  debug?: boolean;

  /** The buyer country. For testing purposes only. */
  buyerCountry?: string;

  /** The locale used to localize any components. */
  locale?: string;
}
