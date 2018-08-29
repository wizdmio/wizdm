import { Injectable, Inject } from '@angular/core';
import { DatabaseService, QueryFn } from '../database/database.service';
import { USER_PROFILE, wmUser, wmProject, wmConversation, wmMessage } from '../interfaces';

import { Observable, of, forkJoin } from 'rxjs';
import { map, tap, take, zip, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(@Inject(USER_PROFILE) 
              private profile  : wmUser,
              private database : DatabaseService) {
  }

  public retriveRecipient(thread: wmConversation): Observable<wmUser> {

    let userId = Object.keys(thread.recipient)
      .find( user => user !== this.profile.id);

    return userId ? this.database.document$(`users/${userId}`)
      .pipe( take(1) ) : of({});
  }

  public retriveMessages(thread: wmConversation, qf?: QueryFn): Observable<wmMessage[]> {
    return this.database.collection$<wmMessage>(`conversations/${thread.id}/messages`, qf)
      .pipe( take(1) );
  }

  private get lastMsg(): QueryFn {
    return ref => ref.orderBy('created', 'desc').limit(1);
  }

  /**
   * Queries for conversations document filling up the last message from the sub-collection of messages
   * @param qf an optional query function
   */
  public queryThreads(qf?: QueryFn): Observable<wmConversation[]> {
    
    return this.database.collection$<wmConversation>(`conversations`, qf)
      .pipe( mergeMap( threads => 
        forkJoin( threads.map( thread => 
          this.retriveMessages(thread, this.lastMsg)
            .pipe( map(msgs => { return { ...thread, last: msgs[0]};}) )
        ))
      ));      
  }

  private sortByDate(a: wmConversation, b: wmConversation) {
    return a.created.toDate().valueOf() - b.created.toDate().valueOf();
  }

  private get myThreads(): QueryFn {
    return ref => ref.where(`recipient.${this.profile.id}`, '==', 'true');
  }

  public queryMyConversations(): Observable<wmConversation[]> {

    return this.queryThreads( this.myThreads );
/*
    return forkJoin(
      
      this.queryConversations(this.toMe).pipe( take(1) ),
      
      this.queryConversations(this.fromMe).pipe( take(1) ),

    ).pipe( zip( ([to, from]) => to.concat(from).sort( this.sortByDate ) ));*/
  }
}
