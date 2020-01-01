import { DatabaseDocument, DatabaseCollection, DistributedCounter, dbCommon } from '@wizdm/connect/database';
import { DatabaseService } from '@wizdm/connect/database';
import { Member, wmMember } from '../member';

export interface wmPublication extends dbCommon {
  
  name    : string;
  pitch?  : string;
  avatar? : string;
  tags?   : string[];
}

export class Publication extends DatabaseDocument<wmPublication> {

  constructor(db: DatabaseService, id: string, readonly member: Member) { 
    super(db, db.doc(`/publications/${id}`)); 
  }

}