import { Injectable } from '@angular/core';
import { DatabaseService, dbStreamFn } from '@wizdm/connect';
import { UserProfile, dbCommon } from '@wizdm/connect';
import { Observable, of, forkJoin } from 'rxjs';
import { map, tap, take, zip, mergeMap } from 'rxjs/operators';

export interface wmConversation extends dbCommon {
  recipient: {
    [key: string]: boolean
  },
  about?   : wmProjectLink,
  last?    : wmMessage

  //messages?: wmMessage[], collection reference
}

export interface wmProjectLink {
  name? : string,
  id?   : string
}

export interface wmMessage  extends dbCommon {
  sender?  : string,
  content? : string,
  unread?  : boolean
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private profile  : UserProfile,
              private database : DatabaseService) {
  }
/*
  public retriveRecipient(thread: wmMessage): Observable<wmUser> {

    let userId = Object.keys(thread.recipient)
      .find( user => user !== this.profile.id);

    return userId ? this.database.document$(`users/${userId}`)
      .pipe( take(1) ) : of({});
  }

  public retriveMessages(thread: wmMessage, qf?: dbQueryFn): Observable<wmMessage[]> {
    return this.database.collection$<wmMessage>(`messages/${thread.id}/messages`, qf)
      .pipe( take(1) );
  }

  private get lastMsg(): dbQueryFn {
    return ref => ref.orderBy('created', 'desc').limit(1);
  }

  public queryThreads(qf?: dbQueryFn): Observable<wmMessage[]> {
    
    return this.database.collection$<wmMessage>(`messages`, qf)
      .pipe( mergeMap( threads => 
        forkJoin( threads.map( thread => 
          this.retriveMessages(thread, this.lastMsg)
            .pipe( map(msgs => { return { ...thread, last: msgs[0]};}) )
        ))
      ));      
  }

  private sortByDate(a: wmMessage, b: wmMessage) {
    return a.created.toDate().valueOf() - b.created.toDate().valueOf();
  }

  private get myThreads(): dbQueryFn {
    return ref => ref.where(`recipient.${this.profile.id}`, '==', 'true');
  }
*/
}
