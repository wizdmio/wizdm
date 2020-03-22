import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiTextModule } from '@wizdm/emoji/text';
import { BalloonModule } from '@wizdm/elements/balloon';
import { ChatViewer } from './viewer.component';

@NgModule({
  imports: [ 
    CommonModule,
    EmojiTextModule,
    BalloonModule
  ],
  declarations: [ ChatViewer ],
  exports: [ ChatViewer ]
})
export class ViewerModule { }
