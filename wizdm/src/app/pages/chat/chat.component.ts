import { take, startWith, map, tap, filter, switchMap, distinctUntilChanged, shareReplay, debounceTime } from 'rxjs/operators';
import { DatabaseCollection, QueryDocumentSnapshot } from '@wizdm/connect/database/collection';
import { Subscription, Observable, Subject, BehaviorSubject, of, merge } from 'rxjs';
import { orderBy, pageReverse } from '@wizdm/connect/database/collection/operators';
import { DatabaseDocument, DocumentData } from '@wizdm/connect/database/document';
import { ChatterData, ConversationData, MessageData } from './chat-types';
import { Component, OnDestroy, Inject, NgZone } from '@angular/core';
import { DatabaseService, Timestamp } from '@wizdm/connect/database';
import { UserProfile } from 'app/utils/user-profile';
import { ScrollObservable } from 'app/utils/scroll';
import { ActivatedRoute } from '@angular/router';
import { EmojiRegex } from '@wizdm/emoji/utils';
import { $animations } from './chat.animations';
import { runInZone } from '@wizdm/rxjs';

@Component({
  selector: 'wm-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: $animations
})
export class ChatComponent extends DatabaseCollection<ConversationData> implements OnDestroy {

  // Conversation(s)
  readonly conversations$: Observable<QueryDocumentSnapshot<ConversationData>[]>;

  private  _conversationId$ = new BehaviorSubject<string>('');
  readonly conversationId$: Observable<string>;

  // Current conversation and status
  private conversation: DatabaseDocument<ConversationData>;
  private status: DatabaseDocument<DocumentData>;
  
  // Messages thread
  private  thread: DatabaseCollection<MessageData>;
  readonly messages$: Observable<QueryDocumentSnapshot<MessageData>[]>;
  public   loadingMessages: boolean = false;

  private lastRead$ = new Subject<Timestamp>();
  private sub: Subscription;
  
  // Scrolling
  readonly scrolled$: Observable<boolean>;
  private  autoScroll: boolean = true;
  
  // Keys
  private stats = { "😂": 1, "👋🏻": 1, "👍": 1, "💕": 1, "🙏": 1 };
  public  keys: string[];
  public  text = "";

  private unreadMap: { [id:string]: number } = { };

  public get me(): string { return this.user.uid; }  
  
  constructor(db: DatabaseService, route: ActivatedRoute, private scroller: ScrollObservable, private user: UserProfile<ChatterData>, 
    @Inject(EmojiRegex) private regex: RegExp, private zone: NgZone) {

    super(db, 'conversations');

    // Gets or creates the conversation with the requested contact
    const contact$ = route.queryParamMap.pipe( 
      // Extracts the @username from the route
      map( params => params.get('contact') ), 
      // Resolves the user, if any
      switchMap( userName => user.fromUserName(userName) ),
      // Resolves the conversation id towards the given user
      switchMap( user => {
        // No user found
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
      // Filters emty values
      filter( value => !!value )
    );

    // Resolves the conversation id
    this.conversationId$ = merge(contact$, this._conversationId$).pipe( distinctUntilChanged(), shareReplay(1) );

    // Streams all the conversations where recipients[] contains the user's id
    this.conversations$ = this.query( qf => qf.where('recipients', 'array-contains', this.user.uid) ).pipe( startWith(null) );

    // Paging observalbe to load the previous messages while scrolling up
    const more$ = scroller.pipe( 
      // Triggers the previous page when approaching the top
      map( scroll => scroll.top < 50 ),
      // Filters for truthfull changes
      startWith(true), distinctUntilChanged(), filter( value => value ),
      // Shows the loading spinner
      tap( () => this.loadingMessages = true ),
      // Asks for the next 20 messages
      map( () => 20 )
    );

    // Streams up to page size messages from the selected conversation
    this.messages$ = this.conversationId$.pipe( 
      // Filters for valid id
      filter( id => !!id ), distinctUntilChanged(), 
      // Stores the curernt conversation
      map( id => this.conversation = this.document(id) ),
      // Retrives the current user conversation status
      tap( conv => this.status = conv.collection('recipients').document(this.me) ),
      // Gets the message thread
      map( conv => this.thread = conv.collection<MessageData>('messages') ),
      // Pages the past messages while scrolling up (note: pages statically load)
      switchMap( thread => thread.pipe( orderBy('created'), pageReverse(more$) ).pipe(
        // Queries for the next message starting from the end of the page to get realtime updates
        switchMap( paged => thread.query( qf => qf.orderBy('created').startAfter( paged[paged.length-1] ) ).pipe(
          // Appends the past paged messages with the latest gotten realtime
          map( latest => paged.concat(latest) )
        ))
      )),
      tap( msgs => {
        // Scrolls for the last message to be visible  
        this.autoScroll && this.afterRender( () => this.scrollToBottom() );
        // Hides the loading spinner
        this.loadingMessages = false;
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

    // Subscribes to the lastRead subject tracking the latest message timestamp
    this.sub = this.lastRead$.pipe( filter( value => !!value), debounceTime(1000) ).subscribe( lastRead => {
      // Saves the lastRead timestamp in the status. We can use overwrite() since no one else is suppose to write
      // this very same document but the current user. The value saved here will be used to compute the covenrsation's
      // unread message count
      this.status.overwrite({ lastRead });
    });

    this.keys = this.sortFavorites(this.stats);
  }

  // Disposes of the subscriptions
  ngOnDestroy() { this.sub.unsubscribe(); }

  /** Switches to the given conversation */
  public selectConversation(id: string) {
    this._conversationId$.next(id);
  }

  /** Updates the lastRead status with the gien timestamp */
  public lastRead(lastRead: Timestamp) {
    this.lastRead$.next(lastRead);
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

  public accumulateUnread(convId: number, count: number) {

    this.unreadMap[convId] = count;
  }

  public get unreadCount(): string {

    return Object.values(this.unreadMap).reduce( (result, value) => {

      const count = +result.replace(/\++$/,'');

      return (count + value).toString() + (value > 10 || result.endsWith('+') ? '+' : '');
      
    }, '0');
  }

  /** ngFor rtacking function */
  public trackById(data: QueryDocumentSnapshot<any>) { 
    return data.id; 
  }

  /** Calls fn right after the last rederign has completed */
  private afterRender( fn: () => void ) {
    this.zone.onStable.pipe( take(1) ).subscribe(fn);
  }
}
