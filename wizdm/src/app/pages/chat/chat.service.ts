import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { query, get } from '@wizdm/connect/database/collection/operators';
import { DatabaseCollection } from '@wizdm/connect/database/collection';
import { DatabaseService } from '@wizdm/connect/database';
import { map, take, switchMap } from 'rxjs/operators';
import { UserProfile } from 'app/utils/user';
import { ConversationData } from './chat-types';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

/** Redirects to the latest conversation, if any */
@Injectable({
  providedIn: 'root'
})
export class ChatService extends DatabaseCollection<ConversationData> implements CanActivate {

  private get me(): string { return this.user.uid; }

  constructor(db: DatabaseService, private user: UserProfile, private router: Router) { 
    super(db, 'conversations');
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    // Gets the requested recipient to chat to, if any
    const userName = route.queryParamMap.get('with');

    // Prevents starting up a conversation on wrong conditions
    if(!this.user.auth.authenticated || userName == this.user.data?.userName) { 
      return false; 
    }

    // Initiate a conversation with the requested user
    if(userName) {

      // Skip unknown users. This may be a result of:
      // 1. a deleted conversation (where the user has been removed from the recipients)
      // 2. a conversation with a user that no longer exists
      if(userName.startsWith('unknown-')) { return of(true); }

      // Resolves the user from the @username next
      return this.user.fromUserName(userName).pipe( take(1), switchMap( user => {

        // Prevents initiating a chat with non existing users or myself
        if(!user || user.id === this.me) { return of(false); }

        // Computes the path for the requested conversation
        const ref = this.ref.doc( this.me < user.id ? this.me.concat(user.id) : user.id.concat(this.me) );
        
        // Uses an array union to fill in the recipients array atomically
        const recipients: any = this.db.arrayUnion(this.user.uid, user.id);

        // Runs a transaction to verify the converstion exists
        return this.db.transaction(trx => {            

          // Read the conversation first
          return trx.snap(ref).then( ({ exists }) => {

            // Ensures the recipients contains both sender and receiver.
            // This is needed since the exisiting conversarion may contain only one party (or none if we are in the middle of a deletion).
            // Using an array union with a merge ensure the array preserves the original values while the missing ones will be appended.
            if(exists) { trx.merge(ref, { recipients }); }

            // ... or creates the conversatin from scratch
            else { trx.set(ref, { recipients }); }

            // Returns true for the routing to proceed
            return true;
          });
        });
      }));
    }

    // Resolves the last user we talked to otherwise...
    return this.pipe( 

      // Gets the last conversation we updated
      query( qf => qf.where('recipients', 'array-contains', this.me).orderBy('updated', 'desc').limit(1) ), get(),
      
      // Switches to the sender
      switchMap( snap => {

        // Simply go throught when no conversation found
        if(snap.empty) { return of(true); }
        
        // Gets the document data
        const data = snap.docs[0].data();
        
        // Seeks for the sender id among recipients
        const sender = data.recipients.find( recipient => recipient != this.me );
        
        // Resolves the user from the sender id. At this point the sender might be null as a result of a conversatrion
        // partially deleted by the other party.
        return this.user.fromUserId(sender).pipe( take(1), map( user => {

          // Gets the @username falling back to the unknown user when missing
          const userName = user?.userName || `unknown-${snap.docs[0].id}`;
                    
          // Redirects to the very same route including the user name this time
          return this.router.createUrlTree(state.url.split('/'), {
            replaceUrl: true,
            queryParams: {
              with: userName
            }
          });
        }));
      })      
    );
  }
}
