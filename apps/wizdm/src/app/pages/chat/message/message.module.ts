import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiTextModule } from '@wizdm/emoji/text';
import { BalloonModule } from '@wizdm/elements/balloon';
import { ChatMessage } from './message.component';

@NgModule({
  imports: [
    CommonModule,
    EmojiTextModule,
    BalloonModule
  ],
  declarations: [ ChatMessage ],
  exports: [ ChatMessage ]
})
export class ChatMessageModule { }
