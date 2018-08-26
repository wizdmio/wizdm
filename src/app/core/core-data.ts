import { InjectionToken } from '@angular/core';
import { Timestamp } from './database/database.service';

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

export interface wmColor {
  key     : string,
  value   : string,
  contrast: string
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

export type wmProjectStatus = 'submitted' | 'evaluation' | 'accepted' | 'rejected' | 'completed' | 'draft' | 'deleted';

export interface wmProject {
  
  name         : string,
  pitch?       : string,
  status?      : wmProjectStatus,
  owner?       : string | wmUser,
  cover?       : string,
  color?       : wmColor,
  document?    : string, // markdown formatted business plan description
  
  //team?        : string[] | wmUser[], collection of users
  //development? : wmDevelopment,

  id?          : string,
  created?     : Timestamp,
  updated?     : Timestamp
}

export interface wmApplication {

  name?          : string, // Application name
  pitch?         : string, // Elevator pitch
  description?   : string, // Background description
  revenues?      : string, // Revenue streams
  players?       : string, // Other similar players
  differences?   : string, // Uniquenesses
  users?         : string, // Target users
  target?        : string, // Target market (geo, ...)
  comments?      : string  // Additional comments
}

export interface wmLink {
  name? : string,
  img?  : string,
  id?   : string
}

export type wmUserLink = wmLink;
export type wmProjectLink = wmLink;

export interface wmConversation {
  from?    : string | wmUser,
  to?      : string | wmUser,
  about?   : wmProjectLink,
  last?    : wmMessage,
  
  //messages?: wmMessage[], collection reference

  id?      : string,
  created? : Timestamp,
  updated? : Timestamp
}

export interface wmMessage {
  sender?  : string | wmUser,
  content? : string,
  unread?  : boolean,

  id?      : string,
  created? : Timestamp,
  updated? : Timestamp
}

export interface wmDevelopment {

  repositoryLink?: string,
  productionLink?: string,
  webLink?       : string
}

export interface wmProjectLog {

  status : wmProjectStatus,
  comment: string,
  user   : string,
  time   : any
}

/*
export interface wmDocument {

  name?        : string,
  content?     : string, // markdown formatted business plan description
  author?      : string | wmUser,

  id?          : string,
  created?     : Timestamp,
  updated?     : Timestamp
}
*/