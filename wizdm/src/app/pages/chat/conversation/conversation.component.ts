import { Component, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { where, orderBy, startAfter, stream, limit } from '@wizdm/connect/database/collection/operators';
import { map, startWith, switchMap, shareReplay, distinctUntilChanged } from 'rxjs/operators';
import { QueryDocumentSnapshot, DatabaseCollection } from '@wizdm/connect/database/collection';
import { DatabaseService, Timestamp } from '@wizdm/connect/database';
import { DatabaseDocument } from '@wizdm/connect/database/document';
import { UserProfile, UserData } from 'app/utils/user';
import { ConversationData, MessageData } from '../chat-types';
import { MatMenuTrigger } from '@angular/material/menu';
import { ThemePalette } from '@angular/material/core'
import { Observable } from 'rxjs';

@Component({
  selector: 'wm-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
  host: {
    '[attr.selected]' : 'highlight',
    '[attr.color]' : 'color'
  }
})
export class Conversation extends DatabaseDocument<ConversationData> {

  private thread$: DatabaseCollection<MessageData>;
  private data: ConversationData;

  /** The conversation data */
  public data$: Observable<ConversationData>;
  /** The sender profile */
  public sender$: Observable<UserData>;
  /** The last message */
  public last$: Observable<MessageData>;
  /** The unread messages count */
  public unread$: Observable<number>;

  /** The conversation id */
  get id(): string { return this.data.id; }
  /** The current user's id */
  get me(): string { return this.user.uid; }

  get deleting(): boolean { return this._deleting; }
  private _deleting: boolean = false;

  /** Computes the unknown user id appending the conversation id */
  get unknownUser(): string { return `unknown-${this.data.id || '0'}`; }

  /** Returns the unread count label */
  public unreadCount(value: number): string {
    return value > 10 ? '10+' : value?.toString();
  }

  constructor(db: DatabaseService, private user: UserProfile) {
    super(db);
  }

  /** Highlight the conversation */
  @Input() highlight: boolean;

  /** Highlighting color */
  @Input() color: ThemePalette;

  /** Shows the unread message counter */
  @Input() showUnread: boolean;

  @Input() set content(conv: QueryDocumentSnapshot<ConversationData>) {

    // Skips useless changes
    if(conv && conv.id === this.ref?.id) { return; }
    
    // Unwraps the document data from the snapshot
    this.data = this.unwrap(conv);

    // Streams new data as an observable
    this.data$ = this.stream().pipe( startWith(this.data), shareReplay(1) );
    
    // The conversation's messages thread
    this.thread$ = this.collection<MessageData>('messages');

    // Assumes the sender being the first recipient differing from the current user
    const senderId = this.data.recipients.find(id => id !== this.me) || 'unknown';

    // Resolves the sender user profile falling back to an unknown userName including the conversation id
    this.sender$ = this.user.fromUserId( senderId ).pipe( map( data => data || { userName: this.unknownUser } ) );

    // Resolves the last message in the thread
    this.last$ = this.thread$.stream( qf => qf.orderBy('created').limitToLast(1) ).pipe( 
      // Gets the last message
      map( msgs => msgs[0] ),
      // Shares the same result to multiple subscribers
      shareReplay(1)
    );

    // Resolves the unread messages count up to 10+ unread messages
    this.unread$ = this.data$.pipe( 
      // Streams the conversation data getting the user's specific lastRead timestamp that will be used as a cursor
      map<ConversationData, Timestamp>( data => data?.status?.[this.me]?.lastRead ), 
      // Filters unchanged values
      distinctUntilChanged( (x, y) => !!x && !!y && x.isEqual(y) ), 
      // Streams the messages...
      switchMap( lastRead => this.thread$.pipe( 
        // Selects sender messages after the lastRead timestamp up to 11 messages
        where('sender', '==', senderId), orderBy('created'), startAfter(lastRead), limit(11), stream(this.db.zone), 
        // Turns the results lenght into the unread counter
        map( msgs => msgs.length ),
        // Shares the same result to all subscribers
        shareReplay(1) 
      ))
    );
  }

  public delete() {

    // Notifies the beginning of the process.
    this.deletingChange.emit(this._deleting = true);

    // Starts by wiping messages in batches of 100
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
      // At last, reports the deletion completed
    }).then( () => this.deletingChange.emit(this._deleting = false) );
  }

  // Gets the menu trigger
  @ViewChild(MatMenuTrigger) private menuTrigger: MatMenuTrigger;
  @HostListener('contextmenu') onContextMenu() {
    // Opens the menu on contextmenu event  
    this.menuTrigger?.openMenu();
    // Prevents default
    return false;
  }

  @Output('deleting') deletingChange = new EventEmitter<boolean>();
}
