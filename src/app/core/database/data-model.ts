
//import { AngularFireAuth } from 'angularfire2/auth';
//import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

export type wmProjectStatus = 'submitted' | 'evaluation' | 'accepted' | 'rejected' | 'completed';

export interface wmProjectLog {

  status: wmProjectStatus,
  comment: string,
  user: string
}

export interface wmApplication {

  name: string,
  
  description: string,
  
  context: {
    players: string,
    diffFactors: string
  },

  market: {
    userProfile: string,
    geoTarget: string
  },

  comments: string
}

export interface wmProject {
  
  application: wmApplication,
  owner:       string,
  team:        string[],
  status:      wmProjectStatus,
  history:     wmProjectLog[]
}