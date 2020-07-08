import { map, tap, filter, switchMap, distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { Observable, BehaviorSubject, of, from, combineLatest } from 'rxjs';
import { ChatterData, ConversationData, MessageData } from '../chat-types';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatabaseDocument } from '@wizdm/connect/database/document';
import { QueryDocumentSnapshot } from '@wizdm/connect/database/collection';
import { query, where, orderBy, endBefore, stream, data } from '@wizdm/connect/database/collection/operators';
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
  public unread$: Observable<number>;

  
  constructor(db: DatabaseService, private user: UserProfile) {

    super(db);
  }

  @Input() set conv(conv: QueryDocumentSnapshot<ConversationData>) {
    
    this.ref = conv.ref;
    this.data = conv.data();
    
    // The conversation's messages thread
    const thread$ = this.collection<MessageData>('messages');

    const senderId = this.data.recipients.find(id => id !== this.user.uid);

    // Resolves the sender user profile
    this.sender$ = this.user.fromUserId( senderId );

    // Resolves the last message in the thread
    this.last$ = thread$.pipe( 
      // Streams the messages
      query( qf => qf.orderBy('created', 'desc').limit(1) ), stream(this.db.zone), data(),
      // Plucks the message body from the array
      map( msgs => msgs[0] ),
      // Shares the same result to multiple subscribers
      shareReplay(1)
    );

    // Builds a last read message document snapshot observable
    const snapshot$ = this.stream().pipe( 
      
      // Captures the last read message id from the conversation's lastRead map
      filter( data => !!data.lastRead ), map( data => data.lastRead?.[this.user.uid] ),

      // Gets the message snapshot, if any
      switchMap( id => thread$.document(id).get() )
    );

    // Resolves the unread messages count
    this.unread$ = snapshot$.pipe( switchMap( snapshot => {

      return thread$.pipe( 
        
        where('sender', '==', senderId), orderBy('crearted', 'desc'), endBefore(snapshot), 
        
        stream(this.db.zone), map( msgs => msgs.length ),

        tap( count => this.unreadCount.emit(count) ),

        shareReplay(1) 
      )
    }));
  }

  @Output() unreadCount = new EventEmitter<number>();
}
