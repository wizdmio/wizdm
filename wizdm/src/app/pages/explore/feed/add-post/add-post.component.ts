import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'
import { DialogComponent } from '@wizdm/elements/dialog';
import { MatDialog } from '@angular/material/dialog';
import { PostData } from '../feed-types'
import { DatabaseDocument } from '@wizdm/connect/database/document';
import { DatabaseService, Timestamp } from '@wizdm/connect/database';
import { UserProfile, UserData } from 'app/utils/user';
import { MediaObserver,  } from '@angular/flex-layout';
import {AddPostService} from './add-post.service'
import {MatExpansionPanel} from '@angular/material/expansion';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {TypeinAdapter} from 'app/utils/textarea';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { HasTouchScreen } from 'app/utils/platform';
import {EmojiUtils} from '@wizdm/emoji/utils';


@Component({
    selector: 'wm-addpost',
    templateUrl: 'add-post.component.html',
    styleUrls: ['add-post.component.scss'],
    host: { 'class': 'wm-addpost' },
    encapsulation: ViewEncapsulation.None,
})

export class AddPostComponent implements  OnInit{

    public post: DatabaseDocument<PostData>;

    private postForm: FormGroup;

    @ViewChild(CdkVirtualScrollViewport) scroller: CdkVirtualScrollViewport;
    @ViewChild(MatExpansionPanel) private emojiKeysPanel: MatExpansionPanel;
    @ViewChild(TypeinAdapter) private typeinAdapter: TypeinAdapter;

    private _value: string;

    /** Input value */
    // set value(value: string) { this.valueChange.emit(this._value = value); }
    // get value(): string { return this._value; }

    /** Favorites keys */
     keys: string[];

    /** Disables the composer */
     set disabled(value: boolean) {

        if( this._disabled = coerceBooleanProperty(value) ) {
            // Force the panel closing when disabled
            this.emojiKeysPanel?.close();
        }
    }
    
    get disabled(): boolean { return this._disabled; }
    private _disabled: boolean = false;

    /** The current user's id */
    get me(): string { return this.user.uid; }
    // mobile responsiveness
    public get mobile(): boolean { return this.media.isActive('xs'); }

    /** Returns the globally used emoji mode */
    public get mode(): 'native'|'web' {
        // Use the very same emoji mode from EmojiSupportModule
        return this.utils.emojiMode();
    }

    public toggleEmojiKeys() {
        return this.emojiKeysPanel.toggle(),  false;
    }

    public typein(key: string) {
        // Uses the TypeInAdapter to insert the key at the current cursor position preventing default to avoid losing focus
        return this.typeinAdapter?.typein(key), false;
    }

    public get userImage(): string {
        return this.user.data.photo || '';
    }

    public get userFirstName(): string {
        let displayName = this.user.data.userName.split('-').slice().pop();
        return displayName || this.user.data.name;
    }

    constructor(db: DatabaseService, private utils: EmojiUtils, private user: UserProfile,
        private addPostService: AddPostService,
        private media: MediaObserver) {
    }

  

    /**
     * savepost
     */
    public savePost(data: PostData) {
        return this.addPostService.savePost(data);
    }

    ngOnInit() {

        this.postForm = new FormGroup({
            text: new FormControl('')
        })
    }
}

