import { Timestamp } from '../database/database.service';

export interface wmFile {
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
