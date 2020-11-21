import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'
import { query, stream, onSnapshot, where, orderBy, limit, endBefore, docs, snap } from '@wizdm/connect/database/collection/operators';
import { DatabaseGroup, QueryDocumentSnapshot } from '@wizdm/connect/database/collection';
import { DatabaseService } from '@wizdm/connect/database';
import { PostData } from './post/post.component';
import { filter, take, map, expand, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatExpansionPanel } from '@angular/material/expansion';
import { TypeinAdapter } from 'app/utils/textarea';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { EmojiUtils } from '@wizdm/emoji/utils';
import { MediaObserver } from '@angular/flex-layout';
import { UserProfile, UserData } from 'app/utils/user';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'wm-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent extends DatabaseGroup<PostData> implements OnInit {

  private postForm: FormGroup;

  @ViewChild(CdkVirtualScrollViewport) scroller: CdkVirtualScrollViewport;
  @ViewChild(MatExpansionPanel) private emojiKeysPanel: MatExpansionPanel;
  @ViewChild(TypeinAdapter) private typeinAdapter: TypeinAdapter;

  readonly feed$: Observable<QueryDocumentSnapshot<PostData>[]>;

  /** Favorites keys */
  keys: string[];

  /** Disables the composer */
  set disabled(value: boolean) {

    if (this._disabled = coerceBooleanProperty(value)) {
      // Force the panel closing when disabled
      this.emojiKeysPanel?.close();
    }
  }

  get disabled(): boolean { return this._disabled; }
  private _disabled: boolean = false;

  // Media queries to switch between desktop/mobile views
  public get mobile(): boolean { return this.media.isActive('xs'); }
  public get desktop(): boolean { return !this.mobile; }

  

  constructor (db: DatabaseService, @Inject(MAT_DIALOG_DATA) matDialogData: any, private matDialogRef: MatDialogRef<any>, private utils: EmojiUtils,
    private media: MediaObserver, private user: UserProfile<UserData>,) {

    super(db, 'feed');

    /** 
     * We de-structure the stream() operator gainng finer access control to the data coming from the database
     */
    this.feed$ = this.pipe(

      // Query for the public posts in descending order by creation date
      where('tags', 'array-contains', 'public'), orderBy('created', 'desc'),

      // Custom operator
      source => source.pipe(

        // Let's read up to 50 old posts
        limit(50), snap(),

        // Let's pre-pend the new posts
        expand(oldOnes => source.pipe(

          // Streams the latest document snapshot
          endBefore(oldOnes[0]), onSnapshot(this.db.zone),

          // Filters out not only the empty emissions but also the local ones (still having pending writes).
          filter(newOnes => newOnes.size > 0 && !newOnes.metadata.hasPendingWrites),

          // Extracts the document snapshots from the query snapshot and proceedes
          docs(), take(1),

          map(newOnes => newOnes.concat(oldOnes))
        ))
      )
    );
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

  ngOnInit() {

    this.postForm = new FormGroup({
      text: new FormControl('')
    })
  }
}
