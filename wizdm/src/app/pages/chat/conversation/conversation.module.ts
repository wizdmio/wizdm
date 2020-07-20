import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { EmojiTextModule } from '@wizdm/emoji/text';
import { AvatarModule } from '@wizdm/elements/avatar';
import { ContentModule } from '@wizdm/content';
import { MomentPipesModule } from '@wizdm/pipes/moment';
import { PipesModule } from '@wizdm/connect/database/pipes';
import { Conversation } from './conversation.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    EmojiTextModule,
    AvatarModule,
    ContentModule,
    MomentPipesModule,
    PipesModule
  ],
  declarations: [ Conversation ],
  exports: [ Conversation ],
})
export class ConversationModule { }
