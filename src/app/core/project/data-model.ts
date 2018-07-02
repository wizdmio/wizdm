
export type wmProjectStatus = 'submitted' | 'evaluation' | 'accepted' | 'rejected' | 'completed' | 'draft';

export interface wmProjectLog {

  status : wmProjectStatus,
  comment: string,
  user   : string,
  time   : any
}

export interface wmApplication {

  description?   : string,
  revenues?      : string,
  context?       : {
    players?     : string,
    differences? : string
  },
  market         : {
    users?       : string,
    target?      : string
  },
  comments?      : string
}

export interface wmDevelopment {

  repositoryLink?: string,
  productionLink?: string,
  webLink?       : string
}

export interface wmProject {
  
  id?          : string,
  name         : string,
  application? : wmApplication,
  development? : wmDevelopment,
  owner?       : string,
  team?        : string[],
  status?      : wmProjectStatus,
  history?     : wmProjectLog[],
  created?     : any,
  updated?     : any
}