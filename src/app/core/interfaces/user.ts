import { InjectionToken } from '@angular/core';
import { Timestamp } from '../database/database.service';

/**
 * USER_PROFILE token. Keeps a sharable snapshot of the current user profile
 * @example constructor( @Inject(USER_PROFILE) private profile: wmUser )
 */
export const USER_PROFILE = new InjectionToken<wmUser>('wmUserProfile', {
  providedIn: 'root',
  factory: () => new Object({}) as wmUser
});

export interface wmUser {

  img?     : string,
  name?    : string,
  email?   : string,
  phone?   : string,
  birth?   : string,
  gender?  : string,
  motto?   : string,
  lang?    : string,

  //uploads? : any, collection reference

  id?      : string,
  created? : Timestamp,
  updated? : Timestamp
}

export interface wmUserFile {
  name?:     string,
  fullName?: string,
  path?:     string,
  size?:     number,
  url?:      string,

  xfer?:     number, // bytes transferred during the upload

  id?      : string,
  created? : Timestamp,
  updated? : Timestamp
}