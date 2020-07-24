import { isAuthenticated, isAuthorized } from "../auth";
import { https } from 'firebase-functions';
import { deleteFolder } from './folders';
import * as express from 'express';
import * as cors from 'cors';

// Initializes the Express app
const appFolders = express();

// Installs the json body parser middleware
appFolders.use(express.json());

// Installs the CORS policy middleware
appFolders.use(cors({ origin: true }));

//appFolders.get('/', isAuthenticated, isAuthorized(['admin']), listFolders );

appFolders.delete('/:uid',  isAuthenticated, isAuthorized(['admin'], { allowSameUser: true }), deleteFolder );


export const folders = https.onRequest(appFolders);
