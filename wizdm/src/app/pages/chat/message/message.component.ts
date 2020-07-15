import { map, takeWhile, startWith, distinctUntilChanged } from 'rxjs/operators';
import { QueryDocumentSnapshot } from '@wizdm/connect/database/collection';
import { DatabaseDocument } from '@wizdm/connect/database/document';
import { DatabaseService } from '@wizdm/connect/database';
import { UserProfile } from 'app/utils/user-profile';
import { Component, Input, Output, EventEmitter } from '@angular/core';
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
export class ChatMessage extends DatabaseDocument<MessageData> {

  /** Deleted observable. Emits true (and completes) whenever the message gets deleted */
  public deleted$: Observable<boolean>;
  /** Message data/body from the query snapshot */
  public data: MessageData;
  /** My user's id */
  public get me(): string { return this.user.uid; }

  constructor(db: DatabaseService, private user: UserProfile) {
    super(db);
  }

  /** Message snaphot */
  @Input() set message(message: QueryDocumentSnapshot<MessageData>) {

    // Unwraps the snapshot
    this.data = this.unwrap(message);

    // Creates an observable to monitor this document deletion
    this.deleted$ = this.asObservable().pipe( 
      // Monitors the exists flag      
      map( snap => !snap.exists ), startWith( !message.exists ),      
      // Filters for changes and completes when deleted
      takeWhile(deleted => !deleted, true),  distinctUntilChanged()
    );

    this.dataChange.emit(this.data);
  }

  /** Emits the unwrapped message data */
  @Output('data') dataChange = new EventEmitter<MessageData>();
}