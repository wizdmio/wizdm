import { where, orderBy, startAfter, stream, limit } from '@wizdm/connect/database/collection/operators';
import { map, tap, startWith, switchMap, shareReplay, distinctUntilChanged } from 'rxjs/operators';
import { QueryDocumentSnapshot, DatabaseCollection } from '@wizdm/connect/database/collection';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatabaseService, Timestamp } from '@wizdm/connect/database';
import { DatabaseDocument } from '@wizdm/connect/database/document';
import { UserProfile, UserData } from 'app/utils/user-profile';
import { ConversationData, MessageData } from '../chat-types';
import { Observable } from 'rxjs';

@Component({
  selector: 'wm-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class Conversation extends DatabaseDocument<ConversationData> {

  private thread$: DatabaseCollection<MessageData>;
  private data: ConversationData;

  /** The sender profile */
  public sender$: Observable<UserData>;
  /** The last message */
  public last$: Observable<MessageData>;
  /** The unread messages count */
  public unread$: Observable<string>;

  get me(): string { return this.user.uid; }

  get unknownUser(): string { return `unknown-${this.data.id || '0'}`; }

  constructor(db: DatabaseService, private user: UserProfile) {
    super(db);
  }

  @Input() set content(conv: QueryDocumentSnapshot<ConversationData>) {

    // Skips useless changes
    if(conv && conv.id === this.ref?.id) { return; }
    
    // Unwraps the document from the snapshot
    this.data = this.unwrap(conv);
    
    // The conversation's messages thread
    this.thread$ = this.collection<MessageData>('messages');

    // Assumes the sender being the first recipient differing from the current user
    const senderId = this.data.recipients.find(id => id !== this.me) || 'unknown';

    // Resolves the sender user profile falling back to an unknown userName including the conversation id
    this.sender$ = this.user.fromUserId( senderId, { userName: this.unknownUser } );

    // Resolves the last message in the thread
    this.last$ = this.thread$.stream( qf => qf.orderBy('created').limitToLast(1) ).pipe( 
      // Plucks the message body from the array
      map( msgs => msgs[0] ),
      // Shares the same result to multiple subscribers
      shareReplay(1)
    );

    // Resolves the unread messages count up to 10+ unread messages
    this.unread$ = this.stream().pipe( 
      // Streams the conversation data getting the user's specific lastRead timestamp that will be used as a cursor
      startWith(this.data), map<ConversationData, Timestamp>( data => data?.[this.me]?.lastRead ), 
      // Filters unchanged values
      distinctUntilChanged( (x, y) => !!x && !!y && x.isEqual(y) ),
      // Streams the messages...
      switchMap( lastRead => this.thread$.pipe( 
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

  public delete() {

    // Starts by wiping my messages in batches of 100
    return this.thread$.wipe( qf => qf.where('sender', '==', this.me).limit(100) ).then( count => {

      console.log('Messages deleted', count);
      // Atomically remove my id from the recipients array
      return this.update( { recipients: this.db.arrayRemove(this.me) as any }).then( () => {
        // Attempts to delete the conversation within a transaction
        return this.db.transaction( trx => {
          // Gets the conversartion data first
          return trx.get(this.ref).then( data => {
            // Deletes the conversation whenever the recipients array is empty
            if(data?.recipients?.length <= 0) { trx.delete(this.ref); }
          });
        });
      });
      // At last, reports the deletion
    }).then( () => this.deleted.emit(this.data.id) );
  }

  @Output() deleted = new EventEmitter<string>();
}
