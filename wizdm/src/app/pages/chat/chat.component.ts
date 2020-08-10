import { take, skip, startWith, map, tap, filter, expand, pluck, switchMap, distinctUntilChanged, shareReplay, takeUntil, delay, debounceTime } from 'rxjs/operators';
import { where, orderBy, startAfter, endBefore, snap, pageReverse, onSnapshot, docs } from '@wizdm/connect/database/collection/operators';
import { Component, AfterViewInit, OnDestroy, Inject, NgZone, ViewChildren, QueryList } from '@angular/core';
import { DatabaseCollection, QueryDocumentSnapshot } from '@wizdm/connect/database/collection';
import { ConversationData, ConversationFavorites, MessageData } from './chat-types';
import { Subscription, Observable, BehaviorSubject, of, combineLatest } from 'rxjs';
import { DatabaseDocument } from '@wizdm/connect/database/document';
import { UserProfile, UserData } from 'app/utils/user';
import { DatabaseService } from '@wizdm/connect/database';
import { Router, ActivatedRoute } from '@angular/router';
import { ScrollObservable } from 'app/utils/scrolling';
import { runInZone, zoneStable } from '@wizdm/rxjs';
import { EmojiRegex } from '@wizdm/emoji/utils';
import { $animations } from './chat.animations';
import { Conversation } from './conversation/conversation.component';
import { Message } from './message/message.component';

@Component({
  selector: 'wm-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: $animations
})
export class ChatComponent extends DatabaseCollection<ConversationData> implements AfterViewInit, OnDestroy {

  // Conversation(s)
  @ViewChildren(Conversation) conversationsList: QueryList<Conversation>;
  private conversation: DatabaseDocument<ConversationData>;
  /** Conversations observable (from DB) */
  readonly conversations$: Observable<QueryDocumentSnapshot<ConversationData>[]>;
  /** Active converastion Id  observable */  
  readonly conversationId$: Observable<string>;
  /** Active conversation observable */
  readonly activeConversation$: Observable<QueryDocumentSnapshot<ConversationData>>;
  
  // Messages thread
  @ViewChildren(Message) messagesList: QueryList<Message>;
  private  thread: DatabaseCollection<MessageData>;
  /** Active conversation's messages (from DB) */
  readonly messages$: Observable<QueryDocumentSnapshot<MessageData>[]>;  
  
  private reload$ = new BehaviorSubject<void>(null);
  public loading: boolean = true;
  public browse: boolean = true;

  public get deleting(): boolean { return this.deletingCount > 0; }
  private deletingCount: number = 0;
  
  // Scrolling
  readonly scrolled$: Observable<boolean>;
  private  autoScroll: boolean = true;
  
  // Keys
  private stats: ConversationFavorites = { "😂": 1, "👋🏻": 1, "👍": 1, "💕": 1, "🙏": 1 };
  public  keys: string[];
  public  text = "";

  public get me(): string { return this.user.uid; }
  private recipient: string = '';
  
  constructor(db: DatabaseService, private route: ActivatedRoute, private router: Router, private scroller: ScrollObservable, 
    private user: UserProfile<UserData>, @Inject(EmojiRegex) private regex: RegExp, private zone: NgZone) {

    super(db, 'conversations');
        
    // Lists all my active conversations
    this.conversations$ = this.reload$.pipe( switchMap( () => this.pipe( 

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
      
      // Replays to all subscribers
      shareReplay(1)
    )));

    // Resolves the current conversation id from the query parameter
    this.conversationId$ = route.queryParamMap.pipe(

      // Extracts the @username from the route
      map( params => params.get('with') || '' ), distinctUntilChanged(), delay(0),

      // Resolves the user, if any
      switchMap( userName => {

        // Catches an unknown user first. This may be a result of:
        // 1. a deleted conversation (where the user has been removed from the recipients)
        // 2. a conversation with a user that no longer exists
        if(userName.startsWith('unknown-')) { 

          // Resets the recipient
          this.recipient = '';

          // Returns the original conversation id
          return of(userName.replace(/^unknown-/, '')); 
        }

        // Go on with a known user
        return user.fromUserName(userName).pipe( take(1), map( user => {

          // Skips unexisting users
          if(!user) { return this.recipient = ''; } 

          // Tracks the new recipient id
          this.recipient = user.id;

          // Computes the path for the requested conversation otherwise
          return (this.me < user.id ? this.me.concat(user.id) : this.recipient.concat(this.me) );
        }));
      }),
      // Filters unchanged values and replays to all subscribers
      shareReplay(1)
    );

    // Resolves the active conversation
    this.activeConversation$ = combineLatest(this.conversations$, this.conversationId$).pipe( 
      map( ([convs, id]) => convs?.find( conv => conv.id === id ) || {} as any) 
    );

    // Paging observalbe to load the previous messages while scrolling up
    const more$ = scroller.pipe( 

      // Triggers the previous page when approaching the top
      map( scroll => scroll.top < 50 ),
      
      // Filters for truthfull changes
      distinctUntilChanged(), filter( value => value ),
      
      // Asks for the next 20 messages
      map( () => 20 ),
      
      // Shows the loading spinner every page
      tap( () => this.loading = true )
    );

    // Streams up to page size messages from the selected conversation
    this.messages$ = this.conversationId$.pipe( 

      // Stores the curernt conversation
      map( id => this.conversation = id && this.document(id) ),
      
      // Gets the message thread
      map( conv => this.thread = conv && conv.collection<MessageData>('messages') ),
      
      // Loads messages from the thread ordered by creation time
      switchMap( thread => thread ? thread.pipe( orderBy('created'), 
        
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
          )),
          // Always starts with an empty array to clear up messages when loading a new conversation
          startWith([])
        )
        // Reverts to an empty array when no conversation is selected
      ) : of([]) ),

      // When done loading....
      zoneStable( zone, () => {        
        // Scrolls for the last message to be visible  
        this.autoScroll && this.scrollToBottom();  
        // Hides the loading spinner
        this.loading = false; 
      }),
      
      // Replays to all subscribers
      shareReplay(1)
    );

    /** Builds an observable telling if the view has been scrolled */
    this.scrolled$ = scroller.pipe( 

      // Measure the scrolling distance from the bottom 
      map( scroll => scroll.bottom >= 50 ),
      
      // Distincts the value on changes only
      distinctUntilChanged(),
      
      // Enables/disables the autoScroll accordingly
      tap( scrolled => this.autoScroll = !scrolled ),
      
      // Run within angular zone
      runInZone(this.zone)
    );
  }

  ngAfterViewInit() {

    // Syncronizes the status saved withing the selected conversation keeping track of the 
    // last read message timestamp for unread counting purposes
    this.sub = this.conversationId$.pipe(

      // Gets the latest status value from the actiev conversation
      switchMap( id => this.fromId(id).pipe( take(1) ) ), map( data => data?.status?.[this.me] ),

      // Loads the status from the active conversation
      tap( status => {

        // Debug
        console.log('Loading', status);
        // Gets the emoji usage stats from the conversation
        this.stats = status?.favorites || this.stats;
        // Updates the favorites emoji based on the new stat
        this.keys = this.sortFavorites(this.stats);
      }),

      // Expands on the last message
      expand( status => this.lastMessage().pipe(

        // Stops saving new data when switching to another conversation
        takeUntil(this.conversationId$.pipe(skip(1))),

        // Extracts the last message timestamp
        map( msg => msg?.created ),

        // Ensures saving only updated data
        filter( created => !!created && (!(status?.lastRead) || ( created > status.lastRead ))), 

        // Saves the new data
        switchMap( lastRead => {
          // Prepares a new status object saving the lastRead timestamp and the conversation favorites
          const newStatus = { favorites: this.stats, lastRead };
          // Debug
          console.log('Saving data', newStatus);
          // Saves the new data returning the new value for the next recursion
          return this.conversation.merge({ status: { [this.me]: newStatus }} )
            .then( () => newStatus );
        }),

        // Completes the emission
        take(1)
      ))

    ).subscribe();
  }

  // Disposes of the subscriptions
  ngOnDestroy() { this.sub.unsubscribe(); }
  private sub: Subscription;

  /** Returns the requested conversation observable provided the id falls among the active ones */
  private fromId(id: string): Observable<ConversationData> {

    // Waits until the view has been rendered
    return this.zone.onStable.pipe( take(1),
      // Catch the QueryList changes
      switchMap( () => this.conversationsList.changes.pipe( startWith(null) ) ),
      // Seeks for the requested conversation
      map( () => this.conversationsList.find( conv => conv.id === id ) ), 
      // Filters out unwanted emissions
      filter( conv => !!conv ), distinctUntilChanged( undefined, conv => conv.id ),
      // Returns the child conversation's data observable
      switchMap( conv => conv.data$ )
    );
  }

  /** Returns the last message currently listed from the active conversation */
  private lastMessage(): Observable<MessageData> {

    // Waits until the view has been rendered
    return this.zone.onStable.pipe( take(1), 
      // Catch the QueryList changes
      switchMap( () => this.messagesList.changes.pipe( startWith(null) ) ),
      // Seeks for the requested message data
      map( () => this.messagesList.last?.data ), 
      // Filters out duplicates
      distinctUntilChanged(),
    );
  }

  /** Tracks the deletion of conversations */
  public onDeleting(flag: boolean, id: string) {
    
    // Tracks how many conversations are in the proess of deleting
    this.deletingCount = this.deletingCount + (flag ? 1 : -1);
    // Once done...
    if(this.deletingCount <= 0) {
      // Resets the text
      this.text = "";
      // Reloads the page 
      this.reload();
    }
  }

  /** Reloads the chat content */
  public reload() {

    // Starts by navigating to this very same route without any queryParameter. 
    // This will update reset the conversationId and the message thread
    return this.router.navigate(['.'], { relativeTo: this.route, replaceUrl:  true })
      // Reloads all the conversations from scratch next
      .then( () => this.reload$.next() );
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
    this.thread.add({ body, sender: this.me, recipient: this.recipient }).then( () => {
      // Enables automatic scrolling
      this.autoScroll = true;
      // Resets the last message text
      this.text = ""; 
    });
    // Prevents default
    return false;
  }

  /** Sorts the favorite keys based on usage */
  private sortFavorites(stats: ConversationFavorites): string[] {
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


  /** ngFor tracking function */
  public trackById(data: QueryDocumentSnapshot<any>) { 
    return data.id; 
  }

  /** Sort conversations based on their updated timestamp */
  private sortByUpdated(data: QueryDocumentSnapshot<any>[], dir?: 'asc'|'desc'): QueryDocumentSnapshot<any>[] {

    const _dir = dir === 'desc' ? -1 : 1;

    return data.sort((a,b) => {

      const aDate = a?.data().updated;
      if(!aDate) { return _dir; }

      const bDate = b?.data().updated;
      if(!bDate) { return -_dir; }
      
      return bDate < aDate ? _dir : (bDate > aDate ? -_dir : 0);
    });
  }
}
