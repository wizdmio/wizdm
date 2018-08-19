import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { DatabaseService, QueryFn } from '../database/database.service';
import { wmUser, wmProject, wmConversation, wmMessage } from '../data-model';

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
    return <QueryFn>(ref => ref.where('from','==', this.userId));
  }

  private get toMe(): QueryFn {
    return <QueryFn>(ref => ref.where('to','==', this.userId));
  }

  private get lastMsg(): QueryFn {
    return <QueryFn>(ref => ref.orderBy('created', 'desc').limit(1));
  }
/*
  private resolveRecipients(conversation: wmConversation): Observable<wmConversation> {
    return forkJoin( 
      this.db.docWithId$<wmUser>(`users/${conversation.from}`),
      this.db.docWithId$<wmUser>(`users/${conversation.to}`) 
    ).pipe( zip( ([from, to]) => { 
        return { ...conversation, from, to };
    }));
  }

  private getLastMessage(conversation: wmConversation): Observable<wmMessage> {
    return this.db.colWithIds$<wmMessage>(`conversations/${conversation.id}/messages`, this.lastMsg)
      .pipe( map( col => col[0] ), take(1) );
  }
*/
  private resolveCollectionContents(conversation: wmConversation): Observable<wmConversation> {

    return forkJoin( 

      this.db.colWithIds$<wmMessage>(`conversations/${conversation.id}/messages`, this.lastMsg),
      
      this.db.docWithId$<wmUser>(`users/${conversation.from}`),
      
      this.db.docWithId$<wmUser>(`users/${conversation.to}`)

    ).pipe( zip( ([msgs, from, to]) => { return { ...conversation, from, to, last: msgs[0] };}) );
  }

  private getConversationsWithContents(qf?: QueryFn): Observable<wmConversation[]> {
    
    return this.db.colWithIds$<wmConversation>(`conversations`, qf)
      .pipe( mergeMap( conversations => 
        forkJoin( conversations.map( conv => 
          this.resolveCollectionContents(conv)
        ))
      ));
  }

  public queryConversationsToMe() {
    return this.getConversationsWithContents(this.toMe);
  }

  public queryConversationsFromMe() {
    return this.getConversationsWithContents(this.fromMe);
  }

  private sortByDate(a: wmConversation, b: wmConversation) {
    return a.created.toDate().valueOf() - b.created.toDate().valueOf();
  }

  public queryMyConversations() {

    return forkJoin(
      
      this.getConversationsWithContents(this.toMe),
      
      this.getConversationsWithContents(this.fromMe),

    ).pipe( zip( ([to, from]) => to.concat(from).sort( this.sortByDate ) ));
  }
}
