
export interface Customer {
  /**
   * The Address of the customer
   */
  address: Address;

  /**
   * The email address of the customer
   */
  email: string;

  /**
   * The full name of the owner
   */
  name: string;

  /**
   * The phone number of the customer
   * NOTE: This includes the extension
   */
  phone: string;

  /**
   * Verified customer’s address
   */
  readonly verified_address: Address;

  /**
   * Verified customer’s email address
   */
  readonly verified_email: string;

  /**
   * Verified customer’s full name
   */
  readonly verified_name: string;

  /**
   * Verified customer’s phone number
   */
  readonly verified_phone: string;
}

// --- CUSTOMER ADDRESS --- //
export interface Address {
  /**
   * City/District/Suburb/Town/Village.
   */
  city: string;

  /**
   * Two-letter country code, capitalized
   * NOTE: The codes are specified by the ISO3166 alpha-2
   */
  country: string;

  /**
   * Address line 1 (Street address/PO Box/Company name).
   */
  line1: string;

  /**
   * Address line 2 (Apartment/Suite/Unit/Building).
   */
  line2: string;

  /**
   * ZIP or postal code
   */
  postal_code: string;

  /**
   * State/County/Province/Region.
   */
  state: string;
}
