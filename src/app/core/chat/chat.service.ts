import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { DatabaseService, QueryFn } from '../database/database.service';
import { wmUser, wmProject, wmConversation, wmMessage } from '../core-data';

import { Observable, of, forkJoin } from 'rxjs';
import { map, tap, take, zip, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private auth: AuthService,
              private db:   DatabaseService) {
  }

  private get userId(): string {
    return this.auth.userId;
  }

  private get fromMe(): QueryFn {
    return <QueryFn>(ref => ref.where('from.id','==', this.userId));
  }

  private get toMe(): QueryFn {
    return <QueryFn>(ref => ref.where('to.id','==', this.userId));
  }

  private get lastMsg(): QueryFn {
    return <QueryFn>(ref => ref.orderBy('created', 'desc').limit(1));
  }

  /**
   * Queries for conversations document filling up the last message from the sub-collection of messages
   * @param qf an optional query function
   */
  public queryConversations(qf?: QueryFn): Observable<wmConversation[]> {
    
    return this.db.colWithIds$<wmConversation>(`conversations`, qf)
      .pipe( mergeMap( convs => 
        forkJoin( convs.map( conv => 
          this.db.colWithIds$<wmMessage>(`conversations/${conv.id}/messages`, this.lastMsg)
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
