import { Observable, Subject, BehaviorSubject, of, merge } from 'rxjs';
import { map, tap, flatMap, throttleTime, distinctUntilChanged } from 'rxjs/operators';
import { DatabaseDocument, dbCommon } from '@wizdm/connect/database';
import { DatabaseService } from '@wizdm/connect/database';
import { wmDocument, wmItem, wmFigure, wmImage } from '@wizdm/editable';
import { Member, wmMember } from '../member';

export interface wmStory extends wmDocument, dbCommon {
  
  author : string;
  pub?   : string;
  tags?  : string[];
}

export class Story extends DatabaseDocument<wmStory> {

  /** Story content observable */
  readonly story$: Observable<wmStory>;
  private _source$ = new Subject<wmStory>();
  
  /** True whenever the current user is the story author */
  readonly mine$: Observable<boolean>;
  
  /** The author user member object */
  readonly author$: Observable<wmMember>;

  /** Story title, if any */
  readonly title$: Observable<string>;

  /** Story brief (the veri first paragraph) */
  readonly brief$: Observable<string>;

  /** Story image */
  readonly image$: Observable<string>;

  /** Bookmark observable, returns true whenever the story is among the current user's bookmarks */
  readonly bookmark$: Observable<boolean>;
  private _bookmark$ = new BehaviorSubject<boolean>(false);

  //private _claps$ = new BehaviorSubject<number>(0);
  //readonly claps$: Observable<number>;

  /** The current authenticate member's id */
  get me() { return this.member.uid || ''; }

  constructor(db: DatabaseService, readonly member: Member) { 
    super(db, null); 

    // Streams the document content dynamically
    this.story$ = this._source$.pipe( 
      // Turns the source story snapshot into its database doc reference
      map( source => source && this.db.doc(`/articles/${source.id}`) || null ),
      // Assign the reference to this very instance
      tap( ref => this.ref = ref ),
      // Streams the content
      flatMap( ref => ref && this.stream() || of(null) ) 
    );

    // Streams true whenever the story is mine
    this.mine$ = this.story$.pipe( map( story => story.author === this.me ) );

    // Streams the document author full member
    this.author$ = this.story$.pipe(
      // Gets the author id
      map( story => story.author ),
      // Resolves the author member
      flatMap( author => author === this.me ? 
        // Short-circuits on the current user
        of(this.member.data) :  
        // Streams the other user member otherwise
        this.db.document<wmMember>(`/users/${author}`).stream() 
      )
    );

    // Streams the document title, if any
    this.title$ = this.story$.pipe( 
      // Extracts the document content
      map( story => story.content ),
      // Extracts the very first item
      map( content => content && content.length > 0 ? content[0] : null ),
      // Whenever the first item is an 'heading' returns its content as a plain text
      map( item => item.type === 'heading' ? this.textify(item) : '')
    );

    // Streams the document brief (the very first paragraph), if any
    this.brief$ = this.story$.pipe( 
      // Extracts the document content
      map( story => story.content ),
      // Extracts the very first paragraph
      map( content => content && content.find( item => item.type === 'paragraph' ) as wmItem ),
      // Whenever the first item is an 'heading' returns its content as a plain text
      map( paragraph => this.textify(paragraph) )
    );

    // Streams the document first image, if any
    this.image$ = this.story$.pipe( 
      // Extracts the document content
      map( story => story.content ),
      // Extracts the very first figure
      map( content => content && content.find( item => item.type === 'figure' ) as wmFigure ),
      // Extracts the image url
      map( figure => this.figurify(figure) )
    );

    // Streams the story's bookmark status from both the user's bookmarks and the local handler
    this.bookmark$ = merge(
      // Gets if the story is already among the user's bookmarks
      this.story$.pipe( flatMap( story => this.member.isBookmarked(story.id) ) ),
      // The local handler updates the bookmarks on request reflecting the status change immediately
      this._bookmark$.pipe( 
        // Trottles the input for 500ms
        throttleTime(500), 
        // Toggles the bookmark
        tap( mark => mark ? this.member.addBookmark(this.id) : this.member.removeBookmark(this.id) ) 
      )
      // Filters the unchanged value updates
    ).pipe( distinctUntilChanged() );
  }

  /** Inits the story with the given source */
  public init(source: wmStory): this {
    return this._source$.next(source), this;
  }

  /** Bookmarks this story */
  public bookmark(mark: boolean) {
    return this._bookmark$.next(mark);
  }

  /** Turns a wmItem into a plain text */
  private textify(item: wmItem): string {
    // Concatenates the text values of all the wmLiterals within the wmItem
    return ('content' in item) ? item.content.reduce( (out, item) => out + item.value || '', '') : '';
  }

  private figurify(figure: wmFigure): string {
    // Extracts the image url from a figure
    return ('content' in figure) && (figure.content.find( item => item.type === 'image') as wmImage || { url: '' }).url || '';
  }

/*
  public delete(): Promise<void> {

    // Wipes the associated likes first
    return this.likes.wipe()
    // Deletes the project from the db
      .then(() => super.delete() )
      // Resets the buffered data
      .then(() => { this.data = <wmStory>{} });
  }
  */
}