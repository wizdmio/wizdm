import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { EmojiTextModule } from '@wizdm/emoji/text';
import { AvatarModule } from '@wizdm/elements/avatar';
import { ContentModule } from '@wizdm/content';
import { MomentPipesModule } from '@wizdm/pipes/moment';
import { Conversation } from './conversation.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    EmojiTextModule,
    AvatarModule,
    ContentModule,
    MomentPipesModule
  ],
  declarations: [ Conversation ],
  exports: [ Conversation ],
})
export class ConversationModule { }
