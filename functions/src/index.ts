import * as admin from 'firebase-admin';
export * from './users';
export * from './folders';
export * from './stripe';

// Initializes the SDK
admin.initializeApp();
