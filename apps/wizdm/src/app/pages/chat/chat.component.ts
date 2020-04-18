import { first, startWith, map, tap, filter, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { Component, AfterViewInit, Inject, ViewChild, NgZone } from '@angular/core';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { DatabaseService, DatabaseCollection } from '@wizdm/connect/database';
import { EmojiRegex } from '@wizdm/emoji/utils';
import { runInZone } from 'app/utils/common';
import { User } from 'app/utils/user-profile';
import { dbChatter, dbConversation, dbMessage } from './chat-types';
import { $animations } from './chat.animations';

@Component({
  selector: 'wm-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: $animations
})
export class ChatComponent extends DatabaseCollection<dbConversation> implements AfterViewInit {

  @ViewChild(CdkScrollable) scroller: CdkScrollable;

  public   scrolled$: Observable<boolean> = of(false);
  readonly conversations$:  Observable<dbConversation[]>;
  readonly messages$:  Observable<dbMessage[]>;

  private conversationId$: BehaviorSubject<string>;

  private thread: DatabaseCollection<dbMessage>;

  private  autoScroll: boolean = true;
  public text = "";
 
  private stats = { "😂": 1, "👋🏻": 1, "👍": 1, "💕": 1, "🙏": 1 };
  public keys: string[];

  public get conversationId(): string { return this.conversationId$.value; }

  public selectConversation(id: string) { 
    this.conversationId$.next(id); 
  }

  public trackById(msg: dbMessage) {
    return msg.id;
  }
  
  constructor(db: DatabaseService, private user: User<dbChatter>, @Inject(EmojiRegex) private regex: RegExp, private zone: NgZone) {

    super(db, 'conversations');

    this.conversationId$ = new BehaviorSubject<string>('');

    // Streams all the conversations where recipients[] contains the user's id
    this.conversations$ = this.stream( qf => qf.where('recipients', 'array-contains', this.user.id) ).pipe(

      tap( convs => {

        if(!this.conversationId) {
          this.selectConversation( this.user.data.lastConversation || convs[0]?.id );
        }
      })
    );

    // Streams up to the last 50 messages
    this.messages$ = this.conversationId$.pipe( 

      filter( id => !!id ),

      distinctUntilChanged(),

      map( id => this.thread = this.db.collection<dbMessage>(`conversations/${id}/messages`) ),
      
      switchMap( thread => thread.stream( qf => qf.orderBy('created', 'asc').limitToLast(50) ) ),
  
      tap( msgs => {

        this.autoScroll && this.afterRender( () => this.scrollToBottom() );
  
        //console.log("last message:",lastMsg);
      })
    );

    this.keys = this.sortFavorites(this.stats);
  }

  ngAfterViewInit() {
    // Replaces the scrolled observable once the cdkScrollable is available
    this.scrolled$ = this.observeScroll();
  }  

  /** Returns an observable telling if the view has been scrolled */
  private observeScroll(): Observable<boolean> {
    // Use the cdkScrollable child. WARNING this observable runs outside the Angular zone. 
    return this.scroller && this.scroller.elementScrolled().pipe(
      // Measure tehe scrolling distance from the bottom 
      map( () => this.scroller.measureScrollOffset('bottom') >= 50 ),
      // Distincts the value on changes only
      distinctUntilChanged(),
      // Starts with false
      startWith(false),
      // Enables/disables the autoScroll accordingly
      tap( scrolled => this.autoScroll = !scrolled ),
      // Run within angular zone
      runInZone(this.zone)
    ) || of(false);
  }

  /** Calls fn right after the last rederign has completed */
  private afterRender( fn: () => void ) {
    this.zone.onStable.pipe( first() ).subscribe(fn);
  }

  /** Scrolls te view to the bottom to make the latest message visible */
  public scrollToBottom() {
    this.scroller?.scrollTo({ bottom: 0 });
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
    this.thread.add({ body, sender: this.user.id }).then( () => {

      // Enables automatic scrolling
      this.autoScroll = true;

      // Resets the last message text
      this.text = ""; 
    });
    //this.chat.send({ body, sender: 'me' }, this.conversationId); 
    
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
