import { Component, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { map, takeWhile, startWith, distinctUntilChanged } from 'rxjs/operators';
import { QueryDocumentSnapshot } from '@wizdm/connect/database/collection';
import { DatabaseDocument } from '@wizdm/connect/database/document';
import { UserProfile, UserData } from 'app/utils/user';
import { DatabaseService } from '@wizdm/connect/database';
import { MatMenuTrigger } from '@angular/material/menu';
import { MessageData } from '../chat-types';
import { Observable } from 'rxjs';

/** Chat message component */
@Component({
  selector: 'wm-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  host: { 
    "class": "wm-message",
    "[class.in]": "data?.sender !== me",
    "[class.out]": "data?.sender === me"
  }
})
export class Message extends DatabaseDocument<MessageData> {

  /** Sender observavble */
  public sender$: Observable<UserData>; 
  /** Deleted observable. Emits true (and completes) whenever the message gets deleted */
  public deleted$: Observable<boolean>;
  /** Message data/body from the query snapshot */
  public data: MessageData;
  
  /** The conversation id */
  get id(): string { return this.data.id; }
  /** The current user's id */
  get me(): string { return this.user.uid; }

  constructor(db: DatabaseService, private user: UserProfile) {
    super(db);
  }

  /** The previous message sender */
  @Input() thread: string;

  /** Message snaphot */
  @Input() set message(message: QueryDocumentSnapshot<MessageData>) {

    // Unwraps the snapshot
    this.data = this.unwrap(message);

    // Resolve the sender data
    this.sender$ = this.user.fromUserId(this.data.sender);

    // Creates an observable to monitor this document deletion across devices.
    this.deleted$ = this.asObservable().pipe( 
      // Monitors the exists flag      
      map( snap => !snap.exists ), startWith( !message.exists ),      
      // Filters for changes and completes when deleted
      takeWhile(deleted => !deleted, true),  distinctUntilChanged()
    );

    // Emits the data payload
    this.dataChange.emit(this.data);
  }

  // Gets the menu trigger
  @ViewChild(MatMenuTrigger) private menuTrigger: MatMenuTrigger;
  @HostListener('contextmenu') onContextMenu() {
    // Opens the menu on contextmenu event  
    this.menuTrigger?.openMenu();
    // Prevents default
    return false;
  }

  /** Emits the unwrapped message data */
  @Output('data') dataChange = new EventEmitter<MessageData>();
}