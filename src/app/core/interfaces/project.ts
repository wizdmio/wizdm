import { dbTimestamp } from '../database/database.service';
import { wmUser } from './user';

export type wmProjectStatus = 'submitted' | 'evaluation' | 'accepted' | 'rejected' | 'completed' | 'draft' | 'deleted';

export interface wmProject {
  
  name         : string,
  pitch?       : string,
  status?      : wmProjectStatus,
  owner?       : string,// | wmUser,
  cover?       : string,
  color?       : string,
  document?    : string, // markdown formatted business plan description
  
  //team?        : string[] | wmUser[], collection of users
  //development? : wmDevelopment,

  id?          : string,
  created?     : dbTimestamp,
  updated?     : dbTimestamp
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
  created?     : dbTimestamp,
  updated?     : dbTimestamp
}
*/