import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { EmojiTextModule } from '@wizdm/emoji/text';
import { IconModule } from '@wizdm/elements/icon';
import { BalloonModule } from '@wizdm/elements/balloon';
import { MomentPipesModule } from '@wizdm/pipes/moment';
import { PipesModule } from '@wizdm/connect/database/pipes';
import { ContentModule } from '@wizdm/content';
import { ChatMessage } from './message.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    EmojiTextModule,
    IconModule,
    BalloonModule,
    MomentPipesModule,
    PipesModule,
    ContentModule
  ],
  declarations: [ ChatMessage ],
  exports: [ ChatMessage ]
})
export class MessageModule { }
