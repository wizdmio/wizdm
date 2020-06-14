import { DocumentData } from '@wizdm/connect/database/document';
import { UserData } from 'app/core/user-profile';

export interface dbChatter extends UserData {
  lastConversation?: string;
}

export interface dbMessage  extends DocumentData {
  
  body: string;
  
  sender: string;
  
  timestamp?: string;
}

export interface dbConversation extends DocumentData {
  
  recipients: string[];
  
  lastRead?: LastRead;
  
  archived?: boolean;
}

export interface LastRead {

  [userId:string]: string;
}