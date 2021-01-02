import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'
import { MediaObserver } from '@angular/flex-layout';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatabaseService } from '@wizdm/connect/database';
import { EmojiUtils } from '@wizdm/emoji/utils';
import { UserProfile, UserData } from 'app/utils/user';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatExpansionPanel } from '@angular/material/expansion';
import { TypeinAdapter } from 'app/utils/textarea';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { PostData } from 'app/pages/explore/feed/post/post.component';
import { DatabaseGroup } from '@wizdm/connect/database/collection';

@Component({
  selector: 'wm-post-dlg',
  templateUrl: './post-dlg.component.html',
  styleUrls: ['./post-dlg.component.scss']
})
export class PostDialogComponent extends DatabaseGroup<PostData> implements OnInit {

  private postForm: FormGroup;

  // Media queries to switch between desktop/mobile views
  public get mobile(): boolean { return this.media.isActive('xs'); }
  public get desktop(): boolean { return !this.mobile; }


  get disabled(): boolean { return this._disabled; }
  private _disabled: boolean = false;

  @ViewChild(CdkVirtualScrollViewport) scroller: CdkVirtualScrollViewport;
  @ViewChild(MatExpansionPanel) private emojiKeysPanel: MatExpansionPanel;
  @ViewChild(TypeinAdapter) private typeinAdapter: TypeinAdapter;


  constructor(db: DatabaseService, @Inject(MAT_DIALOG_DATA) matDialogData: any,
    private matDialogRef: MatDialogRef<PostData>, private utils: EmojiUtils,
    private media: MediaObserver, private user: UserProfile<UserData>,) {
      super(db, 'feed')
  }

  /** Favorites keys */
  keys: string[];

  /** Disables the composer */
  set disabled(value: boolean) {

    if (this._disabled = coerceBooleanProperty(value)) {
      // Force the panel closing when disabled
      this.emojiKeysPanel?.close();
    }
  }


  /** Returns the globally used emoji mode */
  public get mode(): 'native' | 'web' {
    // Use the very same emoji mode from EmojiSupportModule
    return this.utils.emojiMode();
  }

  public toggleEmojiKeys() {
    return this.emojiKeysPanel.toggle(), false;
  }

  public typein(key: string) {
    // Uses the TypeInAdapter to insert the key at the current cursor position preventing default to avoid losing focus
    return this.typeinAdapter?.typein(key), false;
  }

  public get userImage(): string {
    return this.user.data.photo || '';
  }

  public get userFirstName(): string {
    let displayName = this.user?.data?.userName?.split('-').slice().pop();
    return displayName || '';
  }

    public savePost() {

      let data = {"text": this.postForm.value.text, 'tags': ['public']}
      const userCol = this.db.collection('users');
      const userColId = userCol.document(this.user.uid);
      const feedEndpoint = userColId.collection('feed');

      feedEndpoint.add({...data});
  }

  public closePostDialog() {
    return this.matDialogRef.close(null);
   }


  ngOnInit() {
    /**TODO: Add image upload, add post permission using the angular 
     * material chip component, 
     */
    this.postForm = new FormGroup({
      text: new FormControl('')
    })
  }
}
