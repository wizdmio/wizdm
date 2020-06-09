import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiTextModule } from '@wizdm/emoji/text';
import { BalloonModule } from '@wizdm/elements/balloon';
import { MomentPipesModule } from '@wizdm/pipes/moment';
import { ChatMessage } from './message.component';

@NgModule({
  imports: [
    CommonModule,
    EmojiTextModule,
    BalloonModule,
    MomentPipesModule
  ],
  declarations: [ ChatMessage ],
  exports: [ ChatMessage ]
})
export class ChatMessageModule { }
