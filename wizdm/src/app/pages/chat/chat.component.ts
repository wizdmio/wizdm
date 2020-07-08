import { take, startWith, map, tap, filter, switchMap, distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { orderBy, pageReverse, limitToLast, endBefore, snap, data } from '@wizdm/connect/database/collection/operators';
import { DatabaseCollection, QueryDocumentSnapshot } from '@wizdm/connect/database/collection';
import { ChatterData, ConversationData, MessageData } from './chat-types';
import { Component, Inject, NgZone } from '@angular/core';
import { DatabaseService } from '@wizdm/connect/database';
import { UserProfile } from 'app/utils/user-profile';
import { ScrollObservable } from 'app/utils/scroll';
import { ActivatedRoute } from '@angular/router';
import { EmojiRegex } from '@wizdm/emoji/utils';
import { $animations } from './chat.animations';
import { runInZone } from 'app/utils/rxjs';
import { Observable, BehaviorSubject, of, merge } from 'rxjs';

@Component({
  selector: 'wm-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: $animations
})
export class ChatComponent extends DatabaseCollection<ConversationData> {

  // Conversation(s)
  readonly conversations$: Observable<QueryDocumentSnapshot<ConversationData>[]>;

  private  _conversationId$ = new BehaviorSubject<string>('');
  readonly conversationId$: Observable<string>;
  
  // Messages thread
  private  thread: DatabaseCollection<MessageData>;
  readonly messages$:  Observable<MessageData[]>;
  
  // Scrolling
  readonly scrolled$: Observable<boolean>;
  private  autoScroll: boolean = true;

  public loading: boolean = false;
  
  // Keys
  private stats = { "😂": 1, "👋🏻": 1, "👍": 1, "💕": 1, "🙏": 1 };
  public  keys: string[];
  public  text = "";

  public get me(): string { return this.user.uid; }  
  
  constructor(db: DatabaseService, route: ActivatedRoute, private scroller: ScrollObservable, private user: UserProfile<ChatterData>, 
    @Inject(EmojiRegex) private regex: RegExp, private zone: NgZone) {

    super(db, 'conversations');

    // Gets or creates the conversation with the requested contact
    const contact$ = route.queryParamMap.pipe( 
      
      map( params => params.get('contact') ), 

      switchMap( userName => user.fromUserName(userName) ),

      switchMap( user => {

        if(!user) return of('');
        // Computes the path for the requested conversation
        const cid = this.me < user.id ? this.me.concat(user.id) : user.id.concat(this.me);
        // Gets the child document ref
        const ref = this.ref.doc(cid);
        // Runs a transaction
        return this.db.transaction( trx => {
          // Verifies the conversation actually exists
          return trx.get(ref).then( ({ exists }) => {
            // Creates it otherwise
            if(!exists) { trx.set(ref, { recipients: [ this.user.uid, user.id ] }); }
            // Returns the id
            return cid;
          });
        })
      }),
      
      filter( value => !!value )
    );

    // Resolves the conversation id
    this.conversationId$ = merge(contact$, this._conversationId$).pipe( distinctUntilChanged(), shareReplay(1) );

    // Streams all the conversations where recipients[] contains the user's id
    this.conversations$ = this.query( qf => qf.where('recipients', 'array-contains', this.user.uid) ).pipe( startWith(null) );

    // Paging observalbe to load the previous messages while scrolling up
    const more$ = scroller.pipe( 
      // Triggers the previous 50 messages when approaching the top
      map( scroll => scroll.top < 50 ),
      // Filters for truthfull changes
      distinctUntilChanged(), filter( value => value ), startWith(true),
      // Shows the loading spinner
      tap(() => this.loading = true )
    );

    // Streams up to the last 50 messages from the selected conversation
    this.messages$ = this.conversationId$.pipe( 
      // Filters for valid id
      filter( id => !!id ), distinctUntilChanged(),
      // Gets the message thread reference
      map( id => this.thread = this.document(id).collection<MessageData>('messages') ),
      // Pages the latest 50 messages
      switchMap( thread => thread.pipe( orderBy('created'), pageReverse(more$, 50), data() ) ),
      
      tap( msgs => {
        // Scrolls for the last message to be visible  
        this.autoScroll && this.afterRender( () => this.scrollToBottom() );
        // Hides the loading spinner
        this.loading = false;
      })
    );

    /** Builds an observable telling if the view has been scrolled */
    this.scrolled$ = scroller.pipe( 
      // Measure the scrolling distance from the bottom 
      map( scroll => scroll.bottom >= 50 ),
      // Distincts the value on changes only
      distinctUntilChanged(),
      // Starts with false
      startWith(false),
      // Enables/disables the autoScroll accordingly
      tap( scrolled => this.autoScroll = !scrolled ),
      // Run within angular zone
      runInZone(this.zone)
    );

    this.keys = this.sortFavorites(this.stats);
  }  

  public selectConversation(id: string) {
    this._conversationId$.next(id);
  }

  /** Scrolls te view to the bottom to make the latest message visible */
  public scrollToBottom() {
    this.scroller.scrollTo({ bottom: 0 });
  }

  /** Forces the view to scroll whenever the keyboard expanded */
  public onKeyboardExpand() {
    // Scrolls to bottom wheneve the autoScroll mode is enabled
    this.autoScroll && this.scrollToBottom();
  }

  /** Sorts the favorite keys based on usage */
  private sortFavorites(stats: { [key:string]: number }): string[] {
    return Object.keys(stats).sort( (a,b) => stats[b] - stats[a] );
  }

  /** Updates the favorite statistics upon the given message */
  public updateFavorites(body: string) {

    let match; let emojis = [];
    while(match = this.regex.exec(body)) {

      const key = match[0];

      if(emojis.findIndex( emoji => emoji === key ) < 0) {

        emojis.push(match[0]);

        this.stats[key] = (this.stats[key] || 0) + 1;
      }
    }

    if(emojis.length > 0) {
      this.keys = this.sortFavorites(this.stats);
    }
  }

  /** Send the current message */
  public send(body: string) {    
    // Updates the key usage statistics
    this.updateFavorites(body);
    // Sends the message adding it to the current conversation thread
    this.thread.add({ body, sender: this.me }).then( () => {
      // Enables automatic scrolling
      this.autoScroll = true;
      // Resets the last message text
      this.text = ""; 
    });
    // Prevents default
    return false;
  }

  private unreadMap: { [id:string]: number } = { };

  public accumulateUnread(convId: number, count: number) {

    this.unreadMap[convId] = count;
  }

  public get unreadCount(): number {

    return Object.values(this.unreadMap).reduce( (count, value) => {
      return count + value;
    }, 0);
  }

  public trackById(data: ConversationData|MessageData) { 
    return data.id; 
  }

  /** Calls fn right after the last rederign has completed */
  private afterRender( fn: () => void ) {
    this.zone.onStable.pipe( take(1) ).subscribe(fn);
  }
}
