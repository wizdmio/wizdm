import { Component, AfterViewInit, Inject, ViewChild, NgZone } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MediaObserver } from '@angular/flex-layout';
import { EmojiRegex } from '@wizdm/emoji/utils';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { first, startWith, map, flatMap, switchMap, distinctUntilChanged, tap } from 'rxjs/operators';
import { DatabaseService, DatabaseDocument, DatabaseCollection, dbCommon } from '@wizdm/connect/database';
import { Member, dbUser } from 'app/core/member';
import { ChatService, dbConversation, dbMessage } from 'app/core/chat';
import { runInZone } from 'app/utils/common';
import { $animations } from './chat.animations';

export interface dbChatter extends dbUser {
  lastConversation?: string;
}

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

  private  autoScroll: boolean = true;
  public text = "";
 
  private stats = { "😂": 1, "👋🏻": 1, "👍": 1, "💕": 1, "🙏": 1 };
  public keys: string[];

  private thread: DatabaseCollection<dbMessage>;
  
  constructor(db: DatabaseService, private user: Member<dbChatter>, @Inject(EmojiRegex) private regex: RegExp, private zone: NgZone) {

    super(db, 'conversations');

    this.conversationId$ = new BehaviorSubject<string>(this.user.data.lastConversation || '');

    // Streams all the conversations where recipients[] contains the user's id
    this.conversations$ = this.stream( qf => qf.where('recipients', 'array-contains', this.user.id) );

    // Streams up to the last 50 messages
    this.messages$ = this.conversationId$.pipe( 

      distinctUntilChanged(),

      switchMap( id => {

        const doc = this.document(id);

        return doc.exists().then( exists => {

          if(exists) { return doc.get(); }

          return this.get( qf => qf.limit(1) ).then( one => one[0] );

        });
      }),

      tap( conv => this.conversationId$.next(conv.id) ),

      map( conv => this.thread = this.db.collection<dbMessage>(`conversations/${conv.id}/messages`) ),
      
      switchMap( thread => thread.stream( qf => qf.orderBy('created', 'asc').limitToLast(50) )),
  
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

  public trackById(msg: dbMessage) {
    return msg.id;
  }

  public get conversationId(): string { return this.conversationId$.value; }

  public selectConversation(id: string) { 
    this.conversationId$.next(id); 
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
    this.scroller && this.scroller.scrollTo({ bottom: 0 });
  }

  /** Forces the view to scroll whenever the keyboard expanded */
  public onKeyboardExpand() {
    // Scrolls to bottom wheneve the autoSCroll mode is enabled
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
}
