import { Component, AfterViewInit, Inject, ViewChild, NgZone } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MediaObserver } from '@angular/flex-layout';
import { EmojiRegex } from '@wizdm/emoji/utils';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { first, startWith, map, switchMap, distinctUntilChanged, tap } from 'rxjs/operators';
import { ChatService, Group, Message } from 'app/core/chat';
import { runInZone } from 'app/utils/common';
import { $animations } from './chat.animations';

@Component({
  selector: 'wm-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: $animations
})
export class ChatComponent implements AfterViewInit {

  @ViewChild(CdkScrollable) scroller: CdkScrollable;

  public   scrolled$: Observable<boolean> = of(false);
  readonly groups$:  Observable<Group[]>;
  readonly group$:  Observable<Group>;
  readonly messages$:  Observable<Message[]>;

  private groupId$ = new BehaviorSubject<string>('0');

  private  autoScroll: boolean = true;
  public text = "";
 
  private stats = { "😂": 1, "👋🏻": 1, "👍": 1, "💕": 1, "🙏": 1 };
  public keys: string[];

  // Media queries to switch between desktop/mobile views
  public get mobile(): boolean { return this.media.isActive('xs'); }
  public get desktop(): boolean { return !this.mobile; }

  public get groupId(): string { return this.groupId$.value; }
  public set groupId(id: string) { this.groupId$.next(id); }
  
  constructor(@Inject(EmojiRegex) private regex: RegExp, 
                                  private media: MediaObserver, 
                                  private chat: ChatService,  
                                  private zone: NgZone) {

    this.groups$ = chat.groups$;

    this.group$ = this.groupId$.pipe( switchMap( id => this.groups$.pipe(
      map( convs => convs.find( conv => conv.id === id ))
    )));

    this.messages$ = this.group$.pipe(

      switchMap( conv => conv && conv.thread$ || of([]) ),

      tap( thread => this.autoScroll && this.afterRender( () => {
/*
        const lastMsg = thread[thread.length-1];

        if(lastMsg.sender !== 'me') { 

          this.chat.lastRead(this.groupId, 'me', lastMsg);
        }
*/
        this.scrollToBottom();
      }))
    );

    this.keys = this.sortFavorites(this.stats);

    this.chat.receive();
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
    // Enables automatic scrolling
    this.autoScroll = true;
    // Updates the key usage statistics
    this.updateFavorites(body);
    // Sends the message
    this.chat.send({ body, sender: 'me' }, this.groupId); 
    // Resets the last message text
    this.text = ""; 
    // Prevents default
    return false;
  }
}
