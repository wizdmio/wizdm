import { take, startWith, map, tap, filter, expand, pluck, switchMap, distinctUntilChanged, shareReplay, debounceTime, finalize } from 'rxjs/operators';
import { where, orderBy, startAfter, endBefore, snap, stream, stack, fifo, pageReverse, limit, limitToLast, onSnapshot, docs } from '@wizdm/connect/database/collection/operators';
import { DatabaseCollection, QueryDocumentSnapshot } from '@wizdm/connect/database/collection';
import { Subscription, Observable, Subject, BehaviorSubject, of, merge } from 'rxjs';
import { DatabaseDocument, DocumentData } from '@wizdm/connect/database/document';
import { ConversationData, ConversationStatus, MessageData } from './chat-types';
import { Component, OnDestroy, Inject, NgZone } from '@angular/core';
import { DatabaseService, Timestamp } from '@wizdm/connect/database';
import { UserProfile, UserData } from 'app/utils/user-profile';
import { ScrollObservable } from 'app/utils/scrolling';
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
  
  constructor(db: DatabaseService, route: ActivatedRoute, private scroller: ScrollObservable, private user: UserProfile<UserData>, 
    @Inject(EmojiRegex) private regex: RegExp, private zone: NgZone) {

    super(db, 'conversations');

    // Lists all my active conversations
    this.conversations$ = this.pipe( 
      // Selects all the conversations where recipients[] contains my user's id
      where('recipients', 'array-contains', this.me), orderBy('created', 'desc'), 
      // Combines existing conversations with new comers
      source => source.pipe( 
        // Gets the list of existing conversations and sort them by updated value. 
        // Note: we set the cursor apart to avoid messing up with the following queries 
        // since the conversation array will be shuffled
        snap(), map( convs => ({ cursor: convs[0], convs: this.sortByUpdated(convs, 'desc') })),
        // Appends new comers to the top of the list
        expand( ({ cursor, convs }) => source.pipe(
          // Filters out the existing conversation to minimize reads
          endBefore( cursor ),
          // Listens to new conversations
          onSnapshot(zone, { includeMetadataChanges: true }), 
          // Filters out unwanted emissions
          filter( snap => snap.size > 0 && !snap.metadata.hasPendingWrites ),
          // Gets the new documents when available
          docs(), take(1),
          // Prepends the new comers to the existing ones
          map( latest => ({ cursor: latest[0], convs: latest.concat(convs) }) )
        )),
        // Gets rid of the cursor
        pluck('convs')
      ),
      shareReplay(1)
    );

    // Resolves the current conversation id from the query parameter
    this.conversationId$ = route.queryParamMap.pipe(
      // Extracts the @username from the route
      map( params => params.get('with') ),
      // Resolves the user, if any
      switchMap( userName => user.fromUserName(userName) ),
      // Resolves the conversation id towards the given user
      switchMap( user => this.conversations$.pipe( switchMap( convs => {
        // Computes the path for the requested conversation
        const cid = user && (this.me < user.id ? this.me.concat(user.id) : user.id.concat(this.me) );
        // Seeks for the requested conversation among the existing ones
        const conv = cid && convs.find( conv => conv.id === cid ) || convs[0];
        if(conv?.exists) { 
          // Grabs some useful data from the current conversation
          const data = conv.data();
          // Gets the emoji usage stats from the conversation
          this.stats = data[this.me]?.favorites || this.stats;
          // Updates the favorites emoji based on the new stat
          this.keys = this.sortFavorites(this.stats);
          // Returns the id
          return of(conv.id); 
        }
        //...creates a new conversation otherwise
        const ref = this.ref.doc(cid);
        // Runs a transaction
        return this.db.transaction( trx => {
          // Verifies the conversation still doesn't exists
          return trx.snap(ref).then( ({ exists }) => {
            // Creates it otherwise
            if(!exists) { trx.set(ref, { recipients: [ this.user.uid, user.id ] }); }
            // Returns the id
            return cid;
          });
        });
      }))),
      // Filters emty values
      filter( value => !!value ), distinctUntilChanged(), shareReplay(1)
    );

/*
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
          return trx.snap(ref).then( snap => {
            // Creates it otherwise
            if(!snap.exists) { trx.set(ref, { recipients: [ this.user.uid, user.id ] }); }
            
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
*/
    // Streams all the conversations where recipients[] contains the user's id
    //this.conversations$ = this.query( qf => qf.where('recipients', 'array-contains', this.me).orderBy('updated', 'desc') ).pipe( startWith(null) );

        

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
      // Stores the curernt conversation
      map( id => this.conversation = this.document(id) ),
      // Gets the message thread
      map( conv => this.thread = conv.collection<MessageData>('messages') ),

      switchMap( thread => thread.pipe( 
        
        orderBy('created'), 

        //tap( q => console.log(q) ),

        source => source.pipe( 
          
          pageReverse(more$), 
        
          expand( paged => source.pipe(

            startAfter( paged[paged.length - 1] ), 

            onSnapshot(this.db.zone, { includeMetadataChanges: true }), 
            
            filter( snap => snap.size > 0 && !snap.metadata.hasPendingWrites ),
            
            docs(), take(1),
    
            map( latest => paged.concat(latest) )
    
          ))
        )
      )),
      
      /* // Pages the past messages while scrolling up (note: pages statically load)
      switchMap( thread => thread.pipe( orderBy('created'), pageReverse(more$) ).pipe(
        // Queries for the next message starting from the end of the page to get realtime updates
        switchMap( paged => thread.pipe( orderBy('created'), startAfter( paged[paged.length-1] ), stream(this.db.zone) ).pipe(
          // Appends the past paged messages with the latest gotten realtime
          map( latest => paged.concat(latest) )
        ))
      )),*/

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

      // Saves the user's specific information within the conversation. Although this requires that both users
      // concurrently update the same document, comes with the advantage of tracking the last conversation 
      // activity within the updated timestamp to be used for sorting the conversations when listing them
      this.conversation.merge({ [this.me]: { 
        favorites: this.stats,
        lastRead 
      }});
    });

    this.keys = this.sortFavorites(this.stats);
  }

  // Disposes of the subscriptions
  ngOnDestroy() { this.sub.unsubscribe(); }

  /** Switches to the given conversation */
  public selectConversation(conv: QueryDocumentSnapshot<ConversationData>) {
    // Retrives the conversation's data
    const data = conv.data();
    // Gets the emoji uusage stats from the conversation
    this.stats = data[this.me]?.favorites || this.stats;
    // Sorts the favorites emoji based on the new stat
    this.keys = this.sortFavorites(this.stats);
    // Loads the new conversation
    this._conversationId$.next(conv.id);
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

  public accumulateUnread(convId: number, count: number) {

    this.unreadMap[convId] = count;
  }

  public get unreadCount(): string {

    return Object.values(this.unreadMap).reduce( (result, value) => {

      const count = +result.replace(/\++$/,'');

      return (count + value).toString() + (value > 10 || result.endsWith('+') ? '+' : '');
      
    }, '0');
  }

  /** ngFor tracking function */
  public trackById(data: QueryDocumentSnapshot<any>) { 
    return data.id; 
  }

  private sortByUpdated(data: QueryDocumentSnapshot<any>[], dir?: 'asc'|'desc'): QueryDocumentSnapshot<any>[] {

    const _dir = dir === 'desc' ? -1 : 1;

    return data.sort((a,b) => {

      const aDate = a?.data().updated?.toDate();
      if(!aDate) { return _dir; }

      const bDate = b?.data().updated?.toDate();
      if(!bDate) { return -_dir; }
      
      return bDate < aDate ? _dir : (bDate > aDate ? -_dir : 0);
    });
  }

  /** Calls fn right after the last rederign has completed */
  private afterRender( fn: () => void ) {
    this.zone.onStable.pipe( take(1) ).subscribe(fn);
  }
}
