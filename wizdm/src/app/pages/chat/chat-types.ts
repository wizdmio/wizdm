import { DocumentData } from '@wizdm/connect/database/document';
import { Timestamp } from '@wizdm/connect/database';
import { UserData } from 'app/utils/user-profile';

export interface MessageData extends DocumentData {
  
  body: string;
  
  sender: string;
  
  timestamp?: string;
}

export interface ConversationData extends DocumentData {
  
  recipients: string[];
};

export interface ConversationStatus {

  [userId: string]: {
    lastRead?: Timestamp,
    archived?: boolean;
  };
}