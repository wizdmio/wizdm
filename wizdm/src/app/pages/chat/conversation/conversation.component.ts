import { map, tap, filter, switchMap, distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { Observable, BehaviorSubject, of, from, combineLatest } from 'rxjs';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ChatterData, ConversationData, MessageData } from '../chat-types';
import { DatabaseDocument } from '@wizdm/connect/database/document';
import { UserProfile } from 'app/utils/user-profile';
import { DatabaseService } from '@wizdm/connect/database';

@Component({
  selector: 'wm-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class Conversation extends DatabaseDocument<ConversationData> {

  private input$ = new BehaviorSubject<ConversationData>(undefined);

  /** The sender profile */
  readonly sender$: Observable<ChatterData>;
  /** The last message */
  readonly last$: Observable<MessageData>;
  /** The unread messages count */
  readonly unread$: Observable<number>;

  @Input() set data(conv: ConversationData) {
    this.input$.next(conv);
  }

  @Output() unreadCount = new EventEmitter<number>();
  
  constructor(db: DatabaseService, private user: UserProfile) {

    super(db, '');

    // Builds a conversation observable
    const conv$ = this.input$.pipe( 
      // Filters null values
      filter( conv => !!conv ), 
      // Wraps the conversation as this
      tap( conv => this.ref = this.db.doc(`conversations/${conv.id}`) ) 
    ); 

    // The conversation's messages collection
    const messages$ = conv$.pipe( map( () => this.collection<MessageData>('messages') ) );

    // Builds a sender's id observable from conversation's recipients
    const senderId$ = conv$.pipe(
      // Assumes the sender is the first recipient that it's not me (works for group of two, load the group avatar for groups)
      map( conv => conv.recipients.find(id => id !== this.user.id) ),
      // Skips unchanged id values
      distinctUntilChanged()
    );

    // Resolves the sender user profile
    this.sender$ = senderId$.pipe(
      // Loads the user's profile
      switchMap( senderId =>  db.document(`users/${senderId}`).stream() ),
      // Shares the same result to multiple subscribers
      shareReplay(1)
    );    

    // Resolves the last message in the thread
    this.last$ = messages$.pipe( 
      // Streams the messages
      switchMap( messages => messages.stream( qf => qf.orderBy('created', 'desc').limit(1) ) ),
      // Plucks the message body from the array
      map( msgs => msgs[0] ),
      // Shares the same result to multiple subscribers
      shareReplay(1)
    );

    // Builds a last read message document snapshot observable
    const snapshot$ = conv$.pipe(
      // Captures the last read message id rom the conversation's lastRead map
      map( conv => conv.lastRead?.[this.user.id] ), 
      // Skips unchanged id values
      distinctUntilChanged(),
      // Gets the message snapshot, if any
      switchMap( lastId => {
        // Reverts to null when lastId is unknown
        if(!lastId) { return of(null); }
        // Gets the message collection
        const messages = this.collection<MessageData>('messages');
        // Reads the document snapshot
        return from( messages.document(lastId).ref.get() );
      }) 
    );

    // Resolves the unread messages count
    this.unread$ = combineLatest( messages$, senderId$, snapshot$ ).pipe( 
      
      switchMap( ([messages, senderId, snapshot]) => messages.stream( qf => {

        const query = qf.where('sender', "==", senderId).orderBy('created', 'desc');
        
        return (snapshot && snapshot.exists ? query.endBefore(snapshot) : query).limit(11);

      })),
      
      map( msgs => msgs.length ),

      tap( count => this.unreadCount.emit(count) ),

      shareReplay(1) 
    );
  }
}
