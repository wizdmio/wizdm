import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiImageModule } from '@wizdm/emoji/image';
import { EmojiInput } from './emoji-input.component';
import { EmojiControl } from './emoji-control.directive';

@NgModule({
  imports: [ CommonModule, EmojiImageModule ],
  declarations: [ EmojiInput, EmojiControl ],
  exports: [ EmojiInput, EmojiControl ]
})
export class EmojiInputModule { }