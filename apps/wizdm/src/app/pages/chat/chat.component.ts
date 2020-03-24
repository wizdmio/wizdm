import { Component, Inject, ViewChild, NgZone } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { EmojiRegex } from '@wizdm/emoji/utils';
import { Message } from 'app/core/chat';
import { Subscription, Observable } from 'rxjs';
import { first, filter, startWith, map, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FakeMessages } from './fake-messages';
import { $animations } from './chat.animations';

@Component({
  selector: 'wm-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: $animations
})
export class ChatComponent {

  @ViewChild(CdkScrollable) scroller: CdkScrollable;

  private autoScroll = true;
  private sub: Subscription;
  public text = "";
 
  private stats = { "😂": 1, "👋🏻": 1, "👍": 1, "💕": 1, "🙏": 1 };
  public keys: string[];

  get messages$(): Observable<Message[]> { return this.fake.messages$; }

  constructor(@Inject(EmojiRegex) private regex: RegExp, private fake: FakeMessages, private zone: NgZone) {

    this.keys = this.sortFavorites(this.stats);

    fake.receive();
  }

  ngAfterViewInit() {

    this.sub = this.messages$.pipe( filter(() => this.autoScroll), switchMap( () => this.zone.onStable.pipe( first() ) ) )
      .subscribe( () => this.backToBottom() );

    this.sub.add( this.scroller.elementScrolled().pipe( 
      map( () => this.scroller.measureScrollOffset('bottom') < 50 ),
      distinctUntilChanged(),
      startWith(true),
    ).subscribe( auto => this.zone.run( () => {
      console.log( this.autoScroll = auto );
    })));

  }  

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public backToBottom() {
    this.scroller.scrollTo({ bottom: 0 });
  }

  public onKeyboardExpand() {
    this.autoScroll && this.backToBottom();
  }

  private sortFavorites(stats: { [key:string]: number }): string[] {
    return Object.keys(stats).sort( (a,b) => stats[b] - stats[a] );
  }

  public updateFavorites(text: string) {

    let match; let emojis = [];
    while(match = this.regex.exec(text)) {

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

  public send(body: string) {

    this.autoScroll = true;

    this.updateFavorites(body);

    this.fake.send({ body, sender: 'me', timestamp: undefined }); 

    this.text = "";

    return false;
  }
}
