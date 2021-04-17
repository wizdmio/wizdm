import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatabaseDocument } from '@wizdm/connect/database/document';
import { MatChipInputEvent } from '@angular/material/chips';
import { DatabaseService } from '@wizdm/connect/database';
import { UserProfile, UserData } from 'app/utils/user';
import { Component, Inject } from '@angular/core';
import { PostData } from '../post/post.component'

export interface PostEditData {
  id?: string;
}

@Component({
  selector: 'wm-post-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent extends DatabaseDocument<PostData> {

  public data: PostData;

  get author(): UserData { return this.user.data || {}; }

  constructor(db: DatabaseService, private user: UserProfile, private dlg: MatDialogRef<PostData>, @Inject(MAT_DIALOG_DATA) post: PostEditData) { 
    
    // Computes the doc path either if existing or new
    super(db, `users/${user.uid}/feed/${post?.id || db.col(`users/${user.uid}/feed`).doc().id }`);

    console.log(`${ post?.id ? 'Opening' : 'New' } document`, this.ref.id);

    // Opens the existing document...
    if(post?.id) { this.get().then( data => this.data = data ); }
    
    //... or draft a new empty one
    else {
      this.data = { 
        id: this.ref.id,
        tags: ['public'],
        author: this.user.uid,
        type: 'document', content: [{ 
          type: 'paragraph', content: [{ 
            type: 'text', value: '' 
      }]}]};
    }
  }

  public addTag({ input, value }: MatChipInputEvent): void {

    
    
    // Add our fruit
    if ((value || '').trim()) {
      //this.fruits.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  public removeTag(tag: string): void {

    console.log(tag);

    //const index = this.fruits.indexOf(fruit);

    /*if (index >= 0) {
      this.fruits.splice(index, 1);
    }*/
  }

  saveAndClose() {

    console.log('Saving', this.data);
/*
    this.upsert(this.data)
      .then( () => this.dlg.close() );
*/
  }
}
