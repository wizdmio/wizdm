import { where, orderBy, startAfter, stream, limit } from '@wizdm/connect/database/collection/operators';
import { map, tap, startWith, switchMap, shareReplay } from 'rxjs/operators';
import { QueryDocumentSnapshot } from '@wizdm/connect/database/collection';
import { ConversationData, MessageData } from '../chat-types';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatabaseDocument } from '@wizdm/connect/database/document';
import { DatabaseService } from '@wizdm/connect/database';
import { UserProfile, UserData } from 'app/utils/user-profile';
import { Observable } from 'rxjs';

@Component({
  selector: 'wm-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class Conversation extends DatabaseDocument<ConversationData> {

  private data: ConversationData;

  /** The sender profile */
  public sender$: Observable<UserData>;
  /** The last message */
  public last$: Observable<MessageData>;
  /** The unread messages count */
  public unread$: Observable<string>;

  public get me(): string { return this.user.uid; }
  
  constructor(db: DatabaseService, private user: UserProfile) {
    super(db);
  }

  @Input() set conv(conv: QueryDocumentSnapshot<ConversationData>) {

    // Skips useless changes
    if(conv && conv.id === this.ref?.id) { return; }
    
    // Unwraps the document from the snapshot
    this.data = this.unwrap(conv);
    
    // The conversation's messages thread
    const thread$ = this.collection<MessageData>('messages');

    // Assumes the sender being the first recipient differing from the current user
    const senderId = this.data.recipients.find(id => id !== this.me);

    // Resolves the sender user profile
    this.sender$ = this.user.fromUserId( senderId );

    // Resolves the last message in the thread
    this.last$ = thread$.stream( qf => qf.orderBy('created').limitToLast(1) ).pipe( 
      // Plucks the message body from the array
      map( msgs => msgs[0] ),
      // Shares the same result to multiple subscribers
      shareReplay(1)
    );

    // Resolves the unread messages count up to 10+ unread messages
    this.unread$ = this.stream().pipe( 
      // Streams the conversation data getting the user's specific lastRead timestamp that will be used as a cursor
      startWith(this.data), map( data => data?.[this.me]?.lastRead ), 
      // Streams the messages...
      switchMap( lastRead => thread$.pipe( 
        // Selects sender messages after the lastRead timestamp up to 11 messages
        where('sender', '==', senderId), orderBy('created'), startAfter(lastRead), limit(11), stream(this.db.zone), 
        // Notifies the unread count of this conversation
        tap( msgs => this.unreadCount.emit(msgs.length) ),
        // Turns the results lenght into the unread counter
        map( msgs => msgs.length < 10 ? msgs.length.toString() : '10+'),
        // Shares the same result to all subscribers
        shareReplay(1) 
      ))
    );
  }

  @Output() unreadCount = new EventEmitter<number>();
}
