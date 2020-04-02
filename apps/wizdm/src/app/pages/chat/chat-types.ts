import { dbCommon } from '@wizdm/connect/database';
import { dbUser } from 'app/core/member';

export interface dbChatter extends dbUser {
  lastConversation?: string;
}

export interface dbMessage  extends dbCommon {
  
  body: string;
  
  sender: string;
  
  timestamp?: string;
}

export interface dbConversation extends dbCommon {
  
  recipients: string[];
  
  lastRead?: LastRead;
  
  archived?: boolean;
}

export interface LastRead {

  [userId:string]: string;
}