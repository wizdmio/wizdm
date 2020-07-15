import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { EmojiKeyboardComponent } from './emoji-keyboard.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    ScrollingModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  declarations: [ EmojiKeyboardComponent ],
  exports: [ EmojiKeyboardComponent ]
})
export class EmojiKeyboardModule { }