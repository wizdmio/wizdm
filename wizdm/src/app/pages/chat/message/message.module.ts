import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { EmojiTextModule } from '@wizdm/emoji/text';
import { IconModule } from '@wizdm/elements/icon';
import { BalloonModule } from '@wizdm/elements/balloon';
import { MomentPipesModule } from '@wizdm/pipes/moment';
import { PipesModule } from '@wizdm/connect/database/pipes';
import { ContentModule } from '@wizdm/content';
import { Message } from './message.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    MatMenuModule,
    EmojiTextModule,
    IconModule,
    BalloonModule,
    MomentPipesModule,
    PipesModule,
    ContentModule
  ],
  declarations: [ Message ],
  exports: [ Message ]
})
export class MessageModule { }
