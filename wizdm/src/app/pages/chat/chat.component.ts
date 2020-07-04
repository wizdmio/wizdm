import { take, startWith, map, tap, filter, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { ChatterData, ConversationData, MessageData } from './chat-types';
import { DatabaseCollection } from '@wizdm/connect/database/collection';
import { Component, Inject, NgZone } from '@angular/core';
import { DatabaseService } from '@wizdm/connect/database';
import { UserProfile } from 'app/utils/user-profile';
import { tapOnce, runInZone } from 'app/utils/rxjs';
import { ScrollObservable } from 'app/utils/scroll';
import { Observable, BehaviorSubject } from 'rxjs';
import { EmojiRegex } from '@wizdm/emoji/utils';
import { $animations } from './chat.animations';

@Component({
  selector: 'wm-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: $animations
})
export class ChatComponent extends DatabaseCollection<ConversationData> {

  private  conversationId$ = new BehaviorSubject<string>('');
  readonly conversations$:  Observable<ConversationData[]>;
  
  private  thread: DatabaseCollection<MessageData>;
  readonly messages$:  Observable<MessageData[]>;
  
  readonly scrolled$: Observable<boolean>;
  private  autoScroll: boolean = true;
  
  private  stats = { "😂": 1, "👋🏻": 1, "👍": 1, "💕": 1, "🙏": 1 };
  public   keys: string[];
  public   text = "";

  public get me(): string { return this.user.uid; }  
  
  constructor(db: DatabaseService, private scroller: ScrollObservable, private user: UserProfile<ChatterData>, @Inject(EmojiRegex) private regex: RegExp, private zone: NgZone) {

    super(db, 'conversations');

    /** Builds an observable telling if the view has been scrolled */
    this.scrolled$ = scroller.pipe( 
      // Measure thee scrolling distance from the bottom 
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

    // Streams all the conversations where recipients[] contains the user's id
    this.conversations$ = this.stream( qf => qf.where('recipients', 'array-contains', this.user.uid) ).pipe(

      // Selects the most appropriate conversation to start with
      tapOnce( convs => this.selectConversation( this.user.data.lastConversation || convs[0]?.id ) )
    );

    // Streams up to the last 50 messages from the selected conversation
    this.messages$ = this.conversationId$.pipe( 

      filter( id => !!id ),

      distinctUntilChanged(),

      map( id => this.thread = this.document(id).collection<MessageData>('messages') ),
      
      switchMap( thread => thread.stream( qf => qf.orderBy('created').limitToLast(50) ) ),
  
      tap( msgs => {

        this.autoScroll && this.afterRender( () => this.scrollToBottom() );
  
        //console.log("last message:",lastMsg);
      })
    );

    this.keys = this.sortFavorites(this.stats);
  }  

  public trackById(data: ConversationData|MessageData) { 
    return data.id; 
  }

  public get conversationId(): string { 
    return this.conversationId$.value; 
  }

  public selectConversation(id: string) {

    this.conversationId$.next(id); 
  }

  /** Calls fn right after the last rederign has completed */
  private afterRender( fn: () => void ) {
    this.zone.onStable.pipe( take(1) ).subscribe(fn);
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
}
