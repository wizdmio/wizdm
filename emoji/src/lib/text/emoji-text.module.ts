import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiImageModule } from '@wizdm/emoji/image';
import { EmojiText } from './emoji-text.component';

@NgModule({
  imports: [ CommonModule, EmojiImageModule ],
  declarations: [ EmojiText ],
  exports: [ EmojiText ]
})
export class EmojiTextModule { }