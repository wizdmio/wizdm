import { Component, Input } from '@angular/core';
import { DatabaseService, DatabaseDocument, DatabaseCollection, dbCommon } from '@wizdm/connect/database';
import { User, dbConversation, dbMessage } from 'app/core/chat'; 
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map, filter, switchMap, distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { Member, dbUser } from 'app/core/member';
import moment from 'moment';

interface DisplayData extends dbConversation {
  sender: User;
  last: dbMessage;
  unread?: number;
}

@Component({
  selector: 'wm-chat-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ChatConversation {

  private input$ = new BehaviorSubject<dbConversation>(undefined);

  readonly conv$: Observable<dbConversation>;
  readonly sender$: Observable<dbUser>;
  readonly last$: Observable<dbMessage>;
  
  constructor(db: DatabaseService, private user: Member) {

    this.conv$ = this.input$.pipe( filter( conv => !!conv ), shareReplay(1) );

    this.sender$ = this.conv$.pipe(       

      map( conv => conv && conv.recipients.find(id => id !== this.user.id) ),

      distinctUntilChanged(),
      
      switchMap( senderId =>  db.document(`users/${senderId}`).stream() ),

      shareReplay(1)
    );

    this.last$ = this.conv$.pipe( 

      map( conv => conv && conv.id),

      distinctUntilChanged(),

      switchMap( convId => db.collection<dbMessage>(`conversations/${convId}/messages`).stream(

        qf => qf.orderBy('created', 'desc').limit(1)
      )),

      map( msgs => msgs[0] ),

      shareReplay(1)
    );
  }

  @Input() set data(conv: dbConversation) {
    this.input$.next(conv);
  }

  time(timestamp: string) {
    return moment(timestamp, 'x').format("HH:mm");
  }
}
