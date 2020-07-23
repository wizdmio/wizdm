import { take, startWith, map, tap, filter, expand, pluck, switchMap, distinctUntilChanged, shareReplay, debounceTime } from 'rxjs/operators';
import { where, orderBy, startAfter, endBefore, snap, pageReverse, onSnapshot, docs } from '@wizdm/connect/database/collection/operators';
import { DatabaseCollection, QueryDocumentSnapshot } from '@wizdm/connect/database/collection';
import { Subscription, Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { Component, OnDestroy, Inject, NgZone } from '@angular/core';
import { DatabaseService, Timestamp } from '@wizdm/connect/database';
import { DatabaseDocument } from '@wizdm/connect/database/document';
import { UserProfile, UserData } from 'app/utils/user-profile';
import { ConversationData, MessageData } from './chat-types';
import { ScrollObservable } from 'app/utils/scrolling';
import { Router, ActivatedRoute } from '@angular/router';
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
  private  remove$ = new BehaviorSubject<string>('');
  readonly conversationId$: Observable<string>;
  
  // Current conversation and status
  private conversation: DatabaseDocument<ConversationData>;
  
  // Messages thread
  private  thread: DatabaseCollection<MessageData>;
  readonly messages$: Observable<QueryDocumentSnapshot<MessageData>[]>;
  public loadingMessages: boolean = false;
  public unknownRecipient: boolean = false;

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
  
  constructor(db: DatabaseService, route: ActivatedRoute, private router: Router, private scroller: ScrollObservable, 
    private user: UserProfile<UserData>, @Inject(EmojiRegex) private regex: RegExp, private zone: NgZone) {

    super(db, 'conversations');

    this.keys = this.sortFavorites(this.stats);

    // Lists all my active conversations
    this.conversations$ = //combineLatest(

      // Gets the conversarions from the server first
      this.pipe( 
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
            onSnapshot(zone), 
            // Filters out unwanted emissions.
            // Note: we exclude snapshots with pending writes to make sure timestamps are up to date
            filter( snap => snap.size > 0 && !snap.metadata.hasPendingWrites ),
            // Gets the new documents when available
            docs(), take(1),
            // Prepends the new comers to the existing ones
            map( latest => ({ cursor: latest[0], convs: latest.concat(convs) }) )
          )),
          // Gets rid of the cursor
          pluck('convs')
        ),
      /*),

      // Tracks the conversations eventually deleted during this session
      this.remove$.pipe( scan( (removed, remove) => removed.concat(remove), [] as string[] ) )

    ).pipe( */
      // Filters out the deleted conversarions, if any
      //map( ([all, removed]) => removed.length > 0 ? all.filter( conv => removed.indexOf(conv.id) < 0 ) : all ),
      // Skips unecessary emissions
      //distinctUntilChanged((x,y) => x === y || ( x.length == y.length && x.every( (value, index) => value.isEqual(y[index]) ) )),
      // Replays to all subscribers
      shareReplay(1)
    );

    // Resolves the current conversation id from the query parameter
    this.conversationId$ = route.queryParamMap.pipe(
      // Extracts the @username from the route
      map( params => params.get('with') || '' ),
      // Resolves the user, if any
      switchMap( userName => {
        // Catches an unknown user first. This may be a result of a deleted conversation (where the user has been removed from the recipient)
        // or a conversation with a user that no longer exists
        if(this.unknownRecipient = userName.startsWith('unknown-')) { return of(userName.replace(/^unknown-/, '')); }
        // Moves on with the existing user otherwise
        return user.fromUserName(userName).pipe(
          // Resolves the conversation id towards the given user
          switchMap( user => this.conversations$.pipe( switchMap( convs => {
            // Computes the path for the requested conversation
            const cid = user && (this.me < user.id ? this.me.concat(user.id) : user.id.concat(this.me) );
            // Seeks for the requested conversation among the active ones falling back to the very first in case the user were missing
            const conv = user ? convs.find( conv => conv.id === cid ) : convs[0];
            if(conv?.exists) { 
              // Grabs some useful data from the current conversation
              const data = conv.data();
              // Gets the emoji usage stats from the conversation
              this.stats = data[this.me]?.favorites || this.stats;
              // Updates the favorites emoji based on the new stat
              this.keys = this.sortFavorites(this.stats);
              // Returns the existing id
              return of(conv.id); 
            }
            //...creates a new conversation otherwise
            const ref = this.ref.doc(cid);
            // Runs a transaction
            return this.db.transaction( trx => {
              // Verifies the conversation still doesn't exists
              return trx.snap(ref).then( ({ exists }) => {
                // Whenever the conversation exists, at this point, let's make sure the recipients array is full
                // This would eventualy prevent the deletion completes by the other recipient
                if(exists) { 
                  trx.update(ref, { 
                    recipients: this.db.arrayUnion(this.user.uid, user.id) as any,
                    created: this.db.timestamp as any
                  });
                }
                // Creates the conversation from scrath otherwise
                else { trx.set(ref, { recipients: [ this.user.uid, user.id ] }); }
                // Returns the new id
                return cid;
              });
            });
          })))
        );
      }),
      // Filters emty values
      filter( value => !!value ), distinctUntilChanged(), shareReplay(1)
    );

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
      // Loads messages from the thread ordered by creation time
      switchMap( thread => thread.pipe( orderBy('created'), 
        // Combines existing messages with new ones
        source => source.pipe( 
          // Let's start by paging some existing messages
          pageReverse(more$), 
          // Perpare to append new coming messages
          expand( paged => source.pipe(
            // Excludes existing messages
            startAfter( paged[paged.length - 1] ), 
            // Listens for updates
            onSnapshot(this.db.zone), 
            // Filters out unwanted emissions
            filter( snap => snap.size > 0 && !snap.metadata.hasPendingWrites ),
            // Gets the new messages and completes
            docs(), take(1),
            // Appends the new messages to the list
            map( latest => paged.concat(latest) )
          ))
        )
      )),
      // Once done...
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
  }

  // Disposes of the subscriptions
  ngOnDestroy() { this.sub.unsubscribe(); }

  /** Updates the lastRead status with the gien timestamp */
  public lastRead(lastRead: Timestamp) {
    this.lastRead$.next(lastRead);
  }

  public reload() {
    this.router.navigateByUrl('.', {
      queryParams: {}
    });
  }

  /** Revoves the given conversarion from the list of active ones */
  public remove(id: string) {
    this.remove$.next(id);
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

  /** Calls fn right after the last rederign has completed */
  private afterRender( fn: () => void ) {
    this.zone.onStable.pipe( take(1) ).subscribe(fn);
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
}
