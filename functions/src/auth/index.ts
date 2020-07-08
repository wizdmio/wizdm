import { Request, Response } from "express";
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

/** Verifies the authentication status cheking the request header */
export async function isAuthenticated(req: Request, res: Response, next: Function) {
    const { authorization } = req.headers;

    if (!authorization) {

        console.log("Missing authentication header");
        return res.status(401).send({ message: 'Authentication required' });
    }

    if (!authorization.startsWith('Bearer')) {

        console.log("Missing bearer field");
        return res.status(401).send({ message: 'Authentication required' });
    }

    const split = authorization.split('Bearer ');

    if (split.length !== 2) {

        console.log("Invalid bearer format");
        return res.status(401).send({ message: 'Authentication required' });
    }

   try {

        // Decodes the token
       const decodedToken: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken( split[1] );
       
       console.log("decodedToken", JSON.stringify(decodedToken) );
       
       // Stores the decoded token within the locals for further provessing
       res.locals = { ...res.locals, context: decodedToken };

       return next();
    }
    catch (err) { return res.status(500).send({ message: `${err.code} - ${err.message}` }); }
}

/** Checks the user authorization level agains the given roles */
export function isAuthorized(hasRole: string[], opts?: { allowSameUser?: boolean, allowRootEmail?: boolean }) {
    return (req: Request, res: Response, next: Function) => {
       
        // Gets the authentication context
        const { context } = res.locals;
        const { uid } = req.params;
       
        // Authorize the user by root email. Use firebase functions:config:set root.email="value" to set the variables
	    if (opts?.allowRootEmail && context.email && context.email === functions.config().root?.email) {

            console.log("User authorized by root email");
            return next();
        }

        // Authorize the user by matching id
        if (opts?.allowSameUser && uid && context.uid === uid) {

            console.log("User authorized by same uid");
            return next();
        }

        // Authorize the user by role
        if (hasRole.some( role => context[role] )) {

            console.log("User authorized by role");
            return next();
        }

        console.log("Unauthorized user");
        return res.status(403).send({ message: 'Unauthorized user' });
   }
}