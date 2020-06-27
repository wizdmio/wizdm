import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import { usersAPI } from './auth';
import { foldersAPI } from './storage';

// Initializes the SDK
admin.initializeApp();

// Grabs the env variables.
// Use firebase functions:config:set group.key="value" to set the variables
const config = functions.config();

// Initializes the Express app
const app = express();

// Installs the json body parser middleware
app.use(express.json());

// Installs the CORS policy middleware
app.use(cors({ origin: true }));

// Installs users API endpoints
usersAPI(app, config);

foldersAPI(app, config);

// Export the API
export const wizdm = functions.https.onRequest(app);
