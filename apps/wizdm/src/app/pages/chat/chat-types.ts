import { dbCommon } from '@wizdm/connect/database';
import { dbUser } from 'app/utils/user-profile';

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