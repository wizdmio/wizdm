import { map, tap, switchMap, shareReplay } from 'rxjs/operators';
import { Observable, BehaviorSubject, of, from, combineLatest } from 'rxjs';
import { ChatterData, ConversationData, MessageData } from '../chat-types';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatabaseDocument } from '@wizdm/connect/database/document';
import { QueryDocumentSnapshot } from '@wizdm/connect/database/collection';
import { query, where, orderBy, startAfter, stream, limit } from '@wizdm/connect/database/collection/operators';
import { DatabaseService } from '@wizdm/connect/database';
import { UserProfile } from 'app/utils/user-profile';

@Component({
  selector: 'wm-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class Conversation extends DatabaseDocument<ConversationData> {

  private data: ConversationData;

  /** The sender profile */
  public sender$: Observable<ChatterData>;
  /** The last message */
  public last$: Observable<MessageData>;
  /** The unread messages count */
  public unread$: Observable<string>;

  
  constructor(db: DatabaseService, private user: UserProfile) {
    super(db);
  }

  @Input() set conv(conv: QueryDocumentSnapshot<ConversationData>) {
    
    this.ref = conv.ref;
    this.data = conv.data();
    
    // The conversation's messages thread
    const thread$ = this.collection<MessageData>('messages');

    // Assumes the sender being the first recipient differing from the current user
    const senderId = this.data.recipients.find(id => id !== this.user.uid);

    // Resolves the sender user profile
    this.sender$ = this.user.fromUserId( senderId );

    // Resolves the last message in the thread
    this.last$ = thread$.stream( qf => qf.orderBy('created').limitToLast(1) ).pipe( 
      // Plucks the message body from the array
      map( msgs => msgs[0] ),
      // Shares the same result to multiple subscribers
      shareReplay(1)
    );

    // Gets the lastRead timestamp value from the recipients collection where thre reader status is saved under the reader's id
    const lastRead$ = this.collection('recipients').document(this.user.uid).stream().pipe( map( data => data?.lastRead ) );

    // Resolves the unread messages count up to 10+ unread messages
    this.unread$ = lastRead$.pipe( switchMap( lastRead => {
      // Streams the messages...
      return thread$.pipe( 
        // Selects sender messages after the lastRead timestamp up to 11 messages
        where('sender', '==', senderId), orderBy('created'), startAfter(lastRead), limit(11), stream(this.db.zone), 
        // Notifies the unread count of this conversation
        tap( msgs => this.unreadCount.emit(msgs.length) ),
        // Turns the results lenght into the unread counter
        map( msgs => msgs.length < 10 ? msgs.length.toString() : '10+'),
        // Shares the same result to all subscribers
        shareReplay(1) 
      )
    }));
  }

  @Output() unreadCount = new EventEmitter<number>();
}
