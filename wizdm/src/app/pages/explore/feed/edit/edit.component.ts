import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatabaseCollection } from '@wizdm/connect/database/collection';
import { DatabaseDocument } from '@wizdm/connect/database/document';
import { DatabaseService } from '@wizdm/connect/database';
import { Component, Inject } from '@angular/core';
import { PostData } from '../post/post.component'
import { UserProfile } from 'app/utils/user';

export interface PostEditData {
  id?: string;
}

@Component({
  selector: 'wm-post-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent extends DatabaseCollection<PostData> {

  private post: DatabaseDocument<PostData>;
  public data: PostData;

  constructor(user: UserProfile, db: DatabaseService, private dlg: MatDialogRef<PostData>, @Inject(MAT_DIALOG_DATA) post: PostEditData) { 

    super(db, `users/${user.id}/feed`);

    this.post = this.load(post?.id);
  }

  private load(id?: string): DatabaseDocument<PostData>|null {

    if(!id) { return null; }

    const doc = this.document(id);

    doc.get().then( data => this.data = data );

    return doc;
  }

  saveAndClose() {

    if(this.post) {

      this.post.update(this.data)
        .then( () => this.dlg.close() );
    }
    else {

      this.add(this.data)
        .then( () => this.dlg.close() );

    }  
  }
}
