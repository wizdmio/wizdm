import { DocumentData } from '@wizdm/connect/database/document';
import { UserData } from 'app/utils/user-profile';

export interface ChatterData extends UserData {
  lastConversation?: string;
}

export interface MessageData extends DocumentData {
  
  body: string;
  
  sender: string;
  
  timestamp?: string;
}

export interface ConversationData extends DocumentData {
  
  recipients: string[];
  
  lastRead?: LastRead;
  
  archived?: boolean;
}

export interface LastRead {

  [userId:string]: string;
}