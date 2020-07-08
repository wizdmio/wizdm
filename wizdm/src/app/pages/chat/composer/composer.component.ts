import { Component, Input, Output, EventEmitter, Inject, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { HasTouchScreen } from 'app/utils/platform';
import { TypeinAdapter } from 'app/utils/textarea';
import { EmojiUtils } from '@wizdm/emoji/utils';

@Component({
  selector: 'wm-composer',
  templateUrl: './composer.component.html',
  styleUrls: ['./composer.component.scss'],
  host: { "class": "wm-composer" }
})
export class MessageComposer {

  @ViewChild(MatExpansionPanel) private emojiKeysPanel: MatExpansionPanel;
  @ViewChild(TypeinAdapter) private typeinAdapter: TypeinAdapter;

  private _value: string;
  
  /** Input value */
  @Input() 
  set value(value: string) { this.valueChange.emit(this._value = value); }
  get value(): string { return this._value; }

  /** Favorites keys */
  @Input() keys: string[];

  /** Value changes event */
  @Output() valueChange = new EventEmitter<string>();

  /** Keyboard expanded event */
  @Output() expanded = new EventEmitter<void>();

  /** Send message event */
  @Output() send = new EventEmitter<string>();

  constructor(private utils: EmojiUtils, @Inject(HasTouchScreen) readonly touch: boolean) { }

  /** Types in the input the specified key */
  public typein(key: string) {
    // Uses the TypeInAdapter to insert the key at the current cursr position preventing default to avoid losing focus
    return this.typeinAdapter?.typein(key), false;
  }

  /** Toggles emoji keyboard on/off */
  public toggleEmojiKeys() {
    // Prevents default to avoid loosing focus (mousedown)
    return this.emojiKeysPanel.toggle(), false;
  }

  /** True when the native emoji support is requested */
  public get native(): boolean {
    // Use the very same emoji mode from EmojiSupportModule
    return this.utils.emojiMode() === 'native'; 
  }

  /** Selectes how inputs respond to 'Enter' key. */
  public get enterMode() {
    // Always insert a newline when running on touch enabled devices.
    // Require the 'Shift' key otherwise.
    return this.touch ? 'always' : 'shift';
  }

  /** Sends the message on 'Enter' */
  public sendOnEnter(ev: KeyboardEvent) {
    // Sends on 'Enter' only on non-touch enabled devices
    return (this.touch || ev.shiftKey || ev.key !== 'Enter') || this.sendNow();
  }

  public get valid(): boolean {
    return (this.value || '').match(/^\s*$/) === null;
  }

  /** Sends the message emitting the relevant event */
  public sendNow() {

    this.valid && this.send.emit( this.value );
    return false;
  }
}
