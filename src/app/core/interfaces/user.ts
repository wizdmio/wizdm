import { dbTimestamp } from '../database/database.service';

export interface wmUser {

  img?     : string,
  name?    : string,
  email?   : string,
  phone?   : string,
  birth?   : string,
  gender?  : string,
  motto?   : string,
  lang?    : string,
  color?   : string,
  cover?   : string,

  lastApplication?: any,

  //uploads? : any, collection reference

  id?      : string,
  created? : dbTimestamp,
  updated? : dbTimestamp
}
