import { QueryDocumentSnapshot } from '@wizdm/connect/database/collection';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DocumentData } from '@wizdm/connect/database/document';
import { DatabaseService } from '@wizdm/connect/database';
import { EditableDocumentData } from '@wizdm/editable';
import { UserProfile, UserData } from 'app/utils/user';
import { LikableDocument } from 'app/utils/database';
import { $animations } from './post.animation';
import { Observable } from 'rxjs';

export interface PostData extends DocumentData, EditableDocumentData {
  //channel?  : string;
  tags?   : string[]; 
};

@Component({
  selector: 'wm-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  animations: $animations
})
export class PostComponent extends LikableDocument<PostData> {

  /** Data payload */
  public data: PostData;

  /** The post's author */
  public author$: Observable<UserData>;

  constructor(db: DatabaseService, private user: UserProfile<UserData>) { 
    super(db, user.auth)
  }

  @Input() set post(snapshot: QueryDocumentSnapshot<PostData>) { 

    // Initialize the likable document instance
    this.data = this.unwrap(snapshot);

    // Resolves the post's author
    this.author$ = this.user.fromUserId(this.data.author);
  }

  /** Emits on navigation */
  @Output() navigate = new EventEmitter<string>();
}
