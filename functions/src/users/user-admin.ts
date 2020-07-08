import { Request, Response } from "express";
import * as admin from 'firebase-admin'

/** Add a new user */
export async function addUser(req: Request, res: Response) {
   const { displayName, email, phoneNumber, photoURL, disabled, emailVerified, password, customClaims } = req.body;

   console.log('Adding user', email);

   if(!email || !password) { return res.status(400).send({ message: 'Missing fields' }); }
   
   try {

      const auth = admin.auth();

      // Creates the user first
      const user = await auth.createUser({
         displayName,
         email,
         password,
         phoneNumber,
         photoURL,
         disabled,
         emailVerified
      });

      // Sets the user's custom claims if requested
      if(customClaims) { await auth.setCustomUserClaims(user.uid, customClaims); }

      // Returns the newely created user record
      return res.status(201).send(user);

   } catch (err) { return res.status(500).send({ message: `${err.code} - ${err.message}` }); }
}

/** Returns the full UserRecord of the requested user */
export async function getUser(req: Request, res: Response) {
   const { uid } = req.params;

   console.log('Getting user', uid);
   
   try {

      // Get the user and send it back
      const user = await admin.auth().getUser(uid);
      return res.status(201).send(user);

   } catch (err) { return res.status(500).send({ message: `${err.code} - ${err.message}` }); }
}

/** Updates the UserRecord of the requested user */
export async function updateUser(req: Request, res: Response) {
   const { displayName, email, phoneNumber, photoURL, disabled, emailVerified, password, customClaims } = req.body;
   const { uid } = req.params;

   console.log('Updating user', uid);

   const needUpdate = !!(displayName || email || phoneNumber || photoURL || emailVerified || password);

   // Checks for missing fileds allowing customClaims to be null
   if(!(needUpdate || customClaims !== undefined)) { return res.status(400).send({ message: 'Missing fields' }); }
   
   try {

      const auth = admin.auth();

      // Updates the custom user claims first, if needed. Note that null is a valid value for the claims to be reset
      if(customClaims !== undefined) { await auth.setCustomUserClaims(uid, customClaims); }

      // Updates the user wheneven needed
      if(needUpdate) {

         const user = await auth.updateUser(uid, {
            displayName,
            email,
            password,
            phoneNumber,
            photoURL,
            disabled,
            emailVerified
         });

         // Returns the updated user (should include the new custom claims as well)
         return res.status(201).send(user);
      }
      else {

         // Gets the updated user otherwise
         const user = await auth.getUser(uid);

         // Returns the user with the updated claims
         return res.status(201).send(user);
      }

   } catch (err) { return res.status(500).send({ message: `${err.code} - ${err.message}` }); }
}

/** Deletes a user */
export async function deleteUser(req: Request, res: Response) {
   const { uid } = req.params;

   console.log('Deleting user', uid);
   
   try {

      await admin.auth().deleteUser(uid);
      return res.status(201).send({});

   } catch (err) { return res.status(500).send({ message: `${err.code} - ${err.message}` }); }
}

/** Lists users by several identifiers (uid, email, phoneNumber, ...) */
export async function listUsers(req: Request, res: Response) {

   console.log('Listing users', req.body);

   // Checks the  bidy is a non-empty array of identifiers
   if(!Array.isArray(req.body) || req.body.length <= 0) { return res.status(400).send({ message: 'Missing fields' }); }
   
   try {

      // Gets the users by indentifiers
      const result = await admin.auth().getUsers(req.body);
      // Returns the user records array
      return res.status(201).send(result.users);

   } catch (err) { return res.status(500).send({ message: `${err.code} - ${err.message}` }); }
}

/** List all the users sorting the result in ascending UID order */
export async function listAllUsers(req: Request, res: Response) {

   console.log('Listing all users');

   try {
 
      // List all the users with the admin SDK
      const allUsers = await _listAllUsers();
 
      // Sorts the users by UID
      const users = allUsers.sort( (a, b) => a.uid > b.uid ? 1 : (a.uid < b.uid ? -1 : 0) );
     
      // Returns the sorted list of users as an array
      return res.status(201).send(users);
 
   } catch (err) { return res.status(500).send({ message: `${err.code} - ${err.message}` }); }
}

async function _listAllUsers(nextPageToken?: string) {
 
   // List batch of users, 1000 at a time.
   const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
 
   // Recurs to list next batches, if any
   if(listUsersResult.pageToken) {
 
      return listUsersResult.users.concat( await _listAllUsers(listUsersResult.pageToken) );
   }
 
   return listUsersResult.users;
}