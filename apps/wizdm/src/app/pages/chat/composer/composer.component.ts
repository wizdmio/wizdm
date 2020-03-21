import { Component, Input, Output, EventEmitter, Inject, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { EmojiNative } from '@wizdm/emoji/utils';
import { HasTouchScreen } from 'app/utils/has-touchscreen';
import { TypeinAdapter } from './typein-adapter';

@Component({
  selector: 'wm-composer',
  templateUrl: './composer.component.html',
  styleUrls: ['./composer.component.scss']
})
export class ComposerComponent {

  @ViewChild(MatExpansionPanel) emojiKeysPanel: MatExpansionPanel;
  @ViewChild(TypeinAdapter) typeinAdapter: TypeinAdapter;

  private _value: string;
  
  @Input() 
  set value(value: string) { this.valueChange.emit(this._value = value); }
  get value(): string { return this._value; }

  @Input() keys: string[];

  @Output() valueChange = new EventEmitter<string>();

  @Output() send = new EventEmitter<string>();

  constructor(@Inject(EmojiNative) readonly native: boolean, @Inject(HasTouchScreen) readonly touch: boolean) { }

  public typein(key: string) {
/*
    if(this.keys.findIndex(fav => fav === key) < 0) {
      this.keys.push(key);
    }
*/
    // Types the key in the textarea/EmojiInput preventing default to avoid losing focus
    return this.typeinAdapter?.typein(key), false;
  }

  public toggleEmojiKeys() {

    return this.emojiKeysPanel.toggle(), false;
  }

  public get enterMode() {
    return this.touch ? 'always' : 'shift';
  }

  public sendOnEnter(ev: KeyboardEvent) {

    return (this.touch || ev.shiftKey || ev.key !== 'Enter') || this.sendNow();
  }

  public sendNow() {

    return this.send.emit(this.value), false;
  }

}
