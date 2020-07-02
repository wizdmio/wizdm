import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { ContentModule } from '@wizdm/content';
import { ScrollHeight, ScrollHide } from './scrollbar-utils';
import { EmojiKeyboard } from './emoji-keyboard.component';

@NgModule({
  declarations: [ EmojiKeyboard, ScrollHeight, ScrollHide ],
  exports: [ EmojiKeyboard ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ScrollingModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatExpansionModule ,
    ContentModule
  ]
})
export class EmojiKeyboardModule { }