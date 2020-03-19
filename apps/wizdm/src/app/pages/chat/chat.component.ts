import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { EmojiRegex, EmojiNative } from '@wizdm/emoji/utils';
import { TypeinAdapter } from './typein-adapter/typein-adapter.directive';

@Component({
  selector: 'wm-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {

  @ViewChild(TypeinAdapter) typeinAdapter: TypeinAdapter;

  public text = "";
  public mode = 'auto';
  public decoded: string;
  public messages = [];
 
  private stats = { "😂": 1, "👋🏻": 1, "👍": 1, "💕": 1 };
  public keys: string[];
  
  constructor(@Inject(EmojiRegex) private regex: RegExp, @Inject(EmojiNative) readonly native: boolean) { 

    this.keys = this.sortFavorites(this.stats);

    this.updateText(this.text);
  }

  public typein(key: string) {

    if(!this.typeinAdapter) { return false; }

    if(this.keys.findIndex(fav => fav === key) < 0) {
      this.keys.push(key);
    }

    // Types the key in the textarea/EmojiInput
    this.typeinAdapter.typein(key);
    // Prevents the default behavior avoiding focus change
    return false;
  }

  public send() {

    this.updateFavorites(this.text);

    this.messages.push(this.text); 

    this.updateText("");
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

  public updateText(text: string) {
    this.decoded = this.decode(this.text = text);
  }

  private decode(text: string): string {

    return text && text.replace(this.regex, match => {

      let decoded = "";

      for (let codePoint of match) {
        decoded += "\\u{" + codePoint.codePointAt(0).toString(16) +"}";
      } 

      return decoded;
    });
  }

  test(ev: KeyboardEvent) {

    if(ev.key === 'Enter') {
      ev.stopPropagation();
      return false;
    }
  }
}
