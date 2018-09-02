import { dbTimestamp } from '../database/database.service';
//import { wmUser } from './user';

export interface wmProjectLink {
  name? : string,
  id?   : string
}

export interface wmConversation {
  recipient: {
    [key: string]: boolean
  },
  about?   : wmProjectLink,
  last?    : wmMessage,

  //messages?: wmMessage[], collection reference

  id?      : string,
  created? : dbTimestamp,
  updated? : dbTimestamp
}

export interface wmMessage {
  sender?  : string,
  content? : string,
  unread?  : boolean,

  id?      : string,
  created? : dbTimestamp,
  updated? : dbTimestamp
}