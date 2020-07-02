import { StripeError } from './error';

export interface ElementsOptions {
  /**
   * Fonts that should be used for styling the element
   * @see https://stripe.com/docs/stripe-js/reference#stripe-elements
   */
  fonts?: (CssFontSource|CustomFontSource)[];
  /**
   * The translation that should be used for the element text
   * `auto` defaults to the browser language
   * @default 'auto'
   */
  locale?: 'auto'|'ar'|'da'|'de'|'en'|'es'|'fi'|'fr'|'he'|'it'|'ja'|'lt'|'lv'|'ms'|'nb'|'nl'|'pl'|'pt'|'ru'|'sv'|'zh'|string;
}

/**
 * Stripe Elements are customizable UI components used to collect sensitive information in your payment forms.
 * Use an Elements instance to create and manage a group of individual Element instances.
 * @see https://stripe.com/docs/js/elements_object
 */
export interface Elements {
 /**
   * Creates a new element
   * @param type - The type of element that should be created
   * @param options - Any options that should be used to con
   * @return The created element
   */
  create<T extends ElementType>(type: T, options?: ElementOptions<T>): Element<T>;

  /**
   * Looks up a previously created Element by its type.
   * @param type the type of Element to lookup.
   * @return An instance of an Element with a matching type or null
   */
  getElement<T extends ElementType>(type: T): Element<T>;
}

/**
 * Use Element instances to collect sensitive information in your payment forms.
 * For a high-level overview of what you can do with elements, see the Stripe Elements for the web guide.
 * @see https://stripe.com/docs/js/elements_object/get_element
 */
export interface Element<T extends ElementType> {
  /**
   * Attaches your Element to the DOM. It accepts either a CSS Selector (e.g., '#card-element') or a DOM element.
   * @see https://stripe.com/docs/js/element/mount
   */
  mount(domElement: 'string'|HTMLElement): void;

  /**
   * Watch for changes on the element
   * @see https://stripe.com/docs/js/element/events
   * @param event - What event to listen to
   * @param handler - The handler function that is called when the event fires
   */
  on(event: 'change', handler: (event: ChangeEventObject<T>) => void): void;
  on(event: 'click', handler: (event: ClickEventObject) => void): void;
  on(event: 'ready'|'focus'|'blur', handler: (event?: any) => void): void;

 /**
   * Give focus to the element
   * @see https://stripe.com/docs/js/element/other_methods/focus
   */
  focus(): void;

  /**
   * Blur the element
   * @see https://stripe.com/docs/js/element/other_methods/blur
   */
  blur(): void;

  /**
   * Clear the value of the element
   * @see https://stripe.com/docs/js/element/other_methods/clear
   */
  clear(): void;

  /**
   * Unmounts the Element from the DOM
   * Call `element.mount()` to re-attach it to the DOM
   * @see https://stripe.com/docs/js/element/other_methods/unmount
   */
  unmount(): void;

   /**
   * Removes the Element from the DOM and destroys it
   * NOTE: a destroyed element can not be re-activated or re-mounted to the DOM
   * @see https://stripe.com/docs/js/element/other_methods/destroy
   */
  destroy(): void;

  /**
   * Updates the options the Element was initialized with
   * NOTE: Updates are merged into the existing configuration
   * @see https://stripe.com/docs/js/element/other_methods/update
   * @param options - The options that should be used to update the element
   */
  update(options: ElementOptions<T>): void;
}

/**
 * Element Type helpers
 */
export type CardElement = Element<'card'>;
export type CardNumberElement = Element<'cardNumber'>;
export type CardExpiryElement = Element<'cardExpiry'>;
export type CardCvcElement = Element<'cardCvc'>;
export type IbanElement = Element<'iban'>;
export type IdealElement = Element<'ideal'>;
export type ButtonElement = Element<'paymentRequestButton'>;

/**
 * The type of element that can be created by the Elements
 * @see Elements
 */
export type ElementType = 
  | 'card' 
  | 'cardNumber' 
  | 'cardExpiry' 
  | 'cardCvc' 
  | 'iban' 
  | 'ideal' 
  | 'paymentRequestButton';

export type ElementOptions<T extends ElementType> =
  T extends 'card'                 ? CardElementOptions :
  T extends 'cardNumber'           ? CardFieldElementOptions :
  T extends 'cardExpiry'           ? CardFieldElementOptions :
  T extends 'cardCvc'              ? CardFieldElementOptions :
  T extends 'iban'                 ? IbanElementOptions :
  T extends 'ideal'                ? IdealElementOptions :
  T extends 'paymentRequestButton' ? PaymentRequestElementOptions : 
    never;

export type ChangeEventObject<T extends ElementType> = 
  T extends 'card'       ? CardChangeEventObject : 
  T extends 'cardNumber' ? CardNumberChangeEventObject :
  T extends 'cardExpiry' ? CardExpiryChangeEventObject :
  T extends 'cardCvc'    ? CardCvcChangeEventObject :
  T extends 'iban'       ? IbanChangeEventObject :
  T extends 'ideal'      ? IdealChangeEventObject :
    never;


export interface ClickEventObject {
  preventDefault(): void;
}

export interface CardElementOptions extends CardFieldElementOptions {
  /**
   * A pre-filled value
   * NOTE: Sensitive card information (card number, CVC, and expiration date) cannot be pre-filled
   * @see placeholder
   *
   * @example {postalCode: '94110'}
   */
  value?: string | { [key:string]: string; };

  /**
   * Whether or not to hide the postal code
   * NOTE: If you are already collecting a full billing address or postal code elsewhere, set this to `true`
   * @default false
   */
  hidePostalCode?: boolean;

  /**
   * Appearance of the icon in the Element
   */
  iconStyle?: IconStyle;

  /**
   * Whether or not the icon should be hidden
   * @default false
   */
  hideIcon?: boolean;
}

// cardNumber, cardExpiry, cardCvc
export interface CardFieldElementOptions extends CommonElementOptions {
  /**
   * A placeholder text
   * NOTE: This is only available for `cardNumber`, `cardExpiry` & `cardCvc` elements
   */
  placeholder?: string;

  /**
   * Whether or not the input is disabled
   * @default false
   */
  disabled?: boolean;
}

export interface IbanElementOptions extends CommonElementOptions {
  /**
   * Specify the list of countries or country-groups whose IBANs you want to allow
   */
  supportedCountries?: string[];
  /**
   * Customize the country and format of the placeholder IBAN
   * @default 'DE"
   */
  placeholderCountry?: string;

  /**
   * Appearance of the icon in the Element
   */
  iconStyle?: IconStyle;

  /**
   * Whether or not the icon should be hidden
   * @default false
   */
  hideIcon?: boolean;

  /**
   * Whether or not the input is disabled
   * @default false
   */
  disabled?: boolean;
}

export interface IdealElementOptions extends CommonElementOptions {
  /**
   * A pre-filled value for the Element. Can be one of the banks listed in the
   * @see https://stripe.com/docs/sources/ideal#optional-specifying-the-customers-bank
   *
   * @example 'abn_amro'
   */
  value?: string | { [key:string]: string; };

  /**
   * Whether or not the icon should be hidden
   * @default false
   */
  hideIcon?: boolean;

  /**
   * Whether or not the input is disabled
   * @default false
   */
  disabled?: boolean;
}

export interface PaymentRequestElementOptions extends CommonElementOptions {
  paymentRequest?: string;
}

export interface CommonElementOptions {
 /**
   * Set custom class names on the container DOM element when the Stripe Element is in a
   * particular state.
   */
  classes?: {
    base?: string;
    complete?: string;
    empty?: string;
    focus?: string;
    invalid?: string;
    webkitAutofill?: string;
  };
    
  /**
   * Customize appearance using CSS properties
   */
  style?: {
    base?: StyleAttributes;
    complete?: StyleAttributes;
    empty?: StyleAttributes;
    invalid?: StyleAttributes;
  };
}

export interface CardChangeEventObject extends CommonChangeEventObject<'card'> {
  /**
   * The value of the element
   * @see CardElementOptions.value for more information
   * NOTE: This is only filled is the element is of a Card type
   */
  value: { postalCode: string | number } | string;

  /**
   * The type of card that was used
   * @example 'visa'
   * NOTE: This is only available when the element is of Card or Cardnumber type
   */
  brand: string;
}

export interface CardNumberChangeEventObject extends CommonChangeEventObject<'cardNumber'> {
  brand: string;
}

export type CardExpiryChangeEventObject = CommonChangeEventObject<'cardExpiry'>;
  
export type CardCvcChangeEventObject = CommonChangeEventObject<'cardCvc'>;

export interface IbanChangeEventObject extends CommonChangeEventObject<'iban'> {
  /**
   * The country code of the entered IBAN
   * NOTE: This is only available when the element is of IBAN type
   */
  country: string;

  /**
   * The financial institution that services the account whose IBAN was entered into the Element.
   * NOTE: This is only available when the element is of IBAN type
   */
  bankName: string;
} 

export interface IdealChangeEventObject extends CommonChangeEventObject<'ideal'> {
  /**
   * The selected bank. Can be one of the banks listed in the
   * @see https://stripe.com/docs/sources/ideal#optional-specifying-the-customers-bank
   * NOTE: This is also filled when the element is of IdealBank type
   */
  value: any;
} 

export interface CommonChangeEventObject<T extends ElementType> {
  /**
   * The type of the Element that changed.
   */
  elementType: T;
  
  /**
   * true if the value is well-formed and potentially complete
   */
  complete: boolean;
  
  /**
   * true if the value is empty
   */
  empty: boolean;

  /**
   * The current validation error if any
   */
  error?: StripeError;
}

export interface CssFontSource {
  /**
   * A relative or absolute URL pointing to a CSS file with `@font-face` definitions
   * @example 'https://fonts.googleapis.com/css?family=Open+Sans'
   */
  cssSrc: string;
}

export interface CustomFontSource {
  /**
   * The name of the font family
   * @example 'Times New Roman'
   */
  family: string;
  /**
   * A src value pointing to your custom font file.
   * @example
   * 'url(https://somewebsite.com/path/to/font.woff)'
   * 'url(path/to/font.woff)'
   */
  src: string;
  display?: string;
  /**
   * The style of the text
   * @default 'normal'
   */
  style?: string;
  /**
   * A unicode range for the font that should be used
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range
   */
  unicodeRange?: string;
  /**
   * The weight of the font
   * NOTE: This cannot be a number!
   */
  weight?: 'initial' | 'inherit' | 'bold' | 'bolder' | 'lighter' | 'normal' | 'revert' | 'unset';
}

export type IconStyle = 'solid' | 'default';

/**
 * Styling settings for a Stripe Element
 */
export interface StyleAttributes extends StyleOptions {
  ':hover'?: StyleOptions;
  ':focus'?: StyleOptions;
  '::placeholder'?: StyleOptions;
  '::selection'?: StyleOptions;
  ':-webkit-autofill'?: StyleOptions;
  ':disabled'?: StyleOptions;
  '::-ms-clear'?: MSClearOptions;
}

export interface StyleOptions {
  color?: string;
  fontFamily?: string;
  fontSize?: string;
  fontSmoothing?: string;
  fontStyle?: string;
  fontVariant?: string;
  fontWeight?: string | number;
  iconColor?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: string;
  textDecoration?: string;
  textShadow?: string;
  textTransform?: string;
}

export interface MSClearOptions extends StyleOptions {
    display?: string;
}
