import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatBadgeModule } from '@angular/material/badge';
import { EmojiTextModule } from '@wizdm/emoji/text';
import { AvatarModule } from '@wizdm/elements/avatar';
import { ChatConversation } from './conversation.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatBadgeModule,
    EmojiTextModule,
    AvatarModule
  ],
  declarations: [ ChatConversation ],
  exports: [ ChatConversation ],
})
export class ChatConversationModule { }
