import { Component, Inject, ElementRef, ViewChild } from '@angular/core';
import { EmojiRegex } from '@wizdm/emoji/utils';
import { ChatComposer } from './composer';

@Component({
  selector: 'wm-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {

  @ViewChild(ChatComposer, { read: ElementRef }) 
  private composer: ElementRef<HTMLElement>;

  public text = "";
  public messages = [ ];
 
  private stats = { "😂": 1, "👋🏻": 1, "👍": 1, "💕": 1, "🙏": 1 };
  public keys: string[];

  get viewHeight(): number {

    return (this.elref?.nativeElement?.clientHeight || 0) - (this.composer?.nativeElement?.clientHeight || 0) || 100;
  }

  constructor(private elref: ElementRef<HTMLElement>, @Inject(EmojiRegex) private regex: RegExp) {

    this.keys = this.sortFavorites(this.stats);
  }

  private sortFavorites(stats: { [key:string]: number }): string[] {
    return Object.keys(stats).sort( (a,b) => stats[b] - stats[a] );
  }

  public updateFavorites(message: string) {

    let match; let emojis = [];
    while(match = this.regex.exec(message)) {

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

  public send(text: string) {
 
    if(text.match(/^\s*$/)) { return; }

    this.updateFavorites(text);

    this.messages.push(text); 

    this.text = ""; 

    return false;
  }
}
