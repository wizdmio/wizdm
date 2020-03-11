import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EmojiUtils } from '@wizdm/emoji/utils';

@Component({
  selector: 'wm-emoji-keyboard',
  templateUrl: './emoji-keyboard.component.html',
  styleUrls: ['./emoji-keyboard.component.scss'] 
})
export class EmojiKeyboard {

  public selectedGroup = "smileys_and_emotion";

  constructor(private utils: EmojiUtils) { }

  /** Behavior flag either returning 'web' or 'native' depending on the current behavior */
  get behavior(): 'native'|'web' {
    return this.mode === 'auto' ? (this.utils.native ? 'native' : 'web') : this.mode;
  }

  /** Mode flag:
   * 'web' renders emoji as images
   * 'native' renders the text as it is relying on the OS native support
   * 'auto' detects the availability of native support and chooses accordingly
   */
  @Input() mode: 'auto'|'native'|'web' = 'auto';

  @Output() key = new EventEmitter<string>();

  public sendkey(key: string) {
    return this.key.emit(key), false;
  }

  public selectGroup(group: string) {
    return this.selectedGroup = group, false;
  }
}
