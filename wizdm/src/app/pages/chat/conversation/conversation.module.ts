import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EmojiTextModule } from '@wizdm/emoji/text';
import { ReadmeModule } from '@wizdm/readme';
import { AvatarModule } from '@wizdm/elements/avatar';
import { DialogModule } from '@wizdm/elements/dialog';
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
    MatProgressBarModule,
    EmojiTextModule,
    ReadmeModule,
    AvatarModule,
    DialogModule,
    ContentModule,
    MomentPipesModule,
    PipesModule
  ],
  declarations: [ Conversation ],
  exports: [ Conversation ],
})
export class ConversationModule { }
