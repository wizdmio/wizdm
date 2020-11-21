import { DocumentData } from '@wizdm/connect/database/document';


export interface PostData extends DocumentData {
  channel?: string;
  title?  : string;
  text?   : string; 
  photo?  : string;
  author? : string; 
  tags?   : string[]; 
};

