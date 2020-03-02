import { Component, OnInit, Inject } from '@angular/core';
import { EmojiRegex, EmojiNative } from '@wizdm/emoji/utils';

@Component({
  selector: 'wm-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public text = "Playing with emoji \ud83d\ude03\u{1F976}\u{1F469}\u{1F3FB}\u200D\u{1F9B0} - \u{1F64F}\u{1F64F}\u{1F3FF}";
  public debug: string;
  public mode = 'auto';
  

  readonly keys = ['😂', '👋🏻', '💕', '😈', '💣', '🚖', '🐵', '👩‍🦰', '🙏🏾'];

  constructor(@Inject(EmojiRegex) private regex: RegExp, @Inject(EmojiNative) readonly native: boolean) { }

  ngOnInit(): void {
    this.updateText(this.text);
  }

  updateText(text: string) {
    this.debug = this.decode(this.text = text);
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
}
