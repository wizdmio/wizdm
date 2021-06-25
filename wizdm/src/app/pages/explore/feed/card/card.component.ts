import { QueryDocumentSnapshot } from '@wizdm/connect/database/collection';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DocumentData, DatabaseDocument } from '@wizdm/connect/database/document';
import { DatabaseService } from '@wizdm/connect/database';
import { EditableDocumentData } from '@wizdm/editable';
import { UserProfile, UserData } from 'app/utils/user';
import { LikableDocument } from 'app/utils/database';
import { $animations } from './card.animation';
import { Observable } from 'rxjs';

export interface CardData extends DocumentData, EditableDocumentData {
  cover?: string;
  brief?: string;
  tags? : string[]; 
};

@Component({
  selector: 'wm-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  host: { '[style.display]' : "deleted ? 'none' : undefined" },
  animations: $animations
})
export class CardComponent extends DatabaseDocument/*LikableDocument*/<CardData> {

  public deleted: boolean = false;

  /** Data payload */
  public data: CardData;

  /** The post's author */
  public author$: Observable<UserData>;

  /** The currently authenticated userId or 'unknown' */
  public get me(): string { return this.user.uid || 'unknown'; }

  constructor(db: DatabaseService, private user: UserProfile<UserData>) { 
    super(db/*, user.auth*/)
  }

  @Input('data') set card(snapshot: QueryDocumentSnapshot<CardData>) { 

    // Initialize the likable document instance
    this.data = this.unwrap(snapshot);

    // Resolves the post's author
    this.author$ = this.user.fromUserId(this.data?.author);
  }

  /** Emits on navigation */
  @Output() navigate = new EventEmitter<string>();
}
