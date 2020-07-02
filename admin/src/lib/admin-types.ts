
/** General user data */
export interface UserData {

  displayName?: string;
  email?      : string;
  phoneNumber?: string;
  photoURL?   : string;
}

/** User UID indentifier */
export interface UidIdentifier {
  uid: string;
}

/** User email indentifier */
export interface EmailIdentifier {
  email: string;
}

/** User phone indentifier */
export interface PhoneIdentifier {
  phoneNumber: string;
}

/** User provider indentifier */
export interface ProviderIdentifier {
  providerId: string;
  providerUid: string;
}

/** User indentifier */
export type UserIdentifier = UidIdentifier|EmailIdentifier|PhoneIdentifier|ProviderIdentifier;

/** User Info */
export interface UserInfo extends UserData {

  uid         : string;
  providerId  : string;
}

/** UserUpdate record */
export interface UserUpdate extends UserData {

  customClaims?: any;
}

/** Full user record */
export interface UserRecord extends UserUpdate {

  uid         : string;
  providerData: UserInfo[];
  metadata    : UserMetadata;

  emailVerified: boolean;
  disabled     : boolean;
}

/** User metadata */
export interface UserMetadata {

  creationTime: string;
  lastSignInTime: string;
  lastRefreshTime?: string;
}