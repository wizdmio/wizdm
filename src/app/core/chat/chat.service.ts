import { Injectable, Inject } from '@angular/core';
import { DatabaseService, QueryFn } from '../database/database.service';
import { USER_PROFILE, wmUser, wmProject, wmConversation, wmMessage } from '../core-data';

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

  private get fromMe(): QueryFn {
    return ref => ref.where('from','==', this.profile.id);
  }

  private get toMe(): QueryFn {
    return ref => ref.where('to','==', this.profile.id);
  }

  private get lastMsg(): QueryFn {
    return ref => ref.orderBy('created', 'desc').limit(1);
  }

  //public queryMessages(ref: string)

  /**
   * Queries for conversations document filling up the last message from the sub-collection of messages
   * @param qf an optional query function
   */
  public queryConversations(qf?: QueryFn): Observable<wmConversation[]> {
    
    return this.database.colWithIds$<wmConversation>(`conversations`, qf)
      .pipe( mergeMap( convs => 
        forkJoin( convs.map( conv => 
          this.database.colWithIds$<wmMessage>(`conversations/${conv.id}/messages`, this.lastMsg)
            .pipe( map(msgs => { return { ...conv, last: msgs[0]};}) )
        ))
      ));      
  }

  public queryConversationsToMe() {
    return this.queryConversations(this.toMe);
  }

  public queryConversationsFromMe() {
    return this.queryConversations(this.fromMe);
  }

  private sortByDate(a: wmConversation, b: wmConversation) {
    return a.created.toDate().valueOf() - b.created.toDate().valueOf();
  }

  public queryMyConversations() {

    return forkJoin(
      
      this.queryConversations(this.toMe),
      
      this.queryConversations(this.fromMe),

    ).pipe( zip( ([to, from]) => to.concat(from).sort( this.sortByDate ) ));
  }
}
