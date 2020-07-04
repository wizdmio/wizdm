import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatBadgeModule } from '@angular/material/badge';
import { EmojiTextModule } from '@wizdm/emoji/text';
import { AvatarModule } from '@wizdm/elements/avatar';
import { MomentPipesModule } from '@wizdm/pipes/moment';
import { Conversation } from './conversation.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatBadgeModule,
    EmojiTextModule,
    AvatarModule,
    MomentPipesModule
  ],
  declarations: [ Conversation ],
  exports: [ Conversation ],
})
export class ConversationModule { }
