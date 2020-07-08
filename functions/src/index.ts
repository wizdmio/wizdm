import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { appUsers } from './users';
import { appFolders } from './folders';

// Initializes the SDK
admin.initializeApp();

// Export the users API
export const users = functions.https.onRequest(appUsers);

// Export the folders API
export const folders = functions.https.onRequest(appFolders);