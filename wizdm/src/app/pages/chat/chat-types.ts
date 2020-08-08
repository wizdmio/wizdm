import { DocumentData } from '@wizdm/connect/database/document';
import { Timestamp } from '@wizdm/connect/database';
import { UserData } from 'app/utils/user';

export interface MessageData extends DocumentData {
  body: string;
  sender: string;
  recipient: string;
}

export interface ConversationData extends DocumentData {
  recipients: string[];
  status?: ConversationStatus;
};

export interface ConversationStatus {
  [userId: string]: {
    lastRead?: Timestamp;
    favorites?: ConversationFavorites;
    archived?: boolean;
  };
}

export interface ConversationFavorites {
  [emoji: string]: number;
}