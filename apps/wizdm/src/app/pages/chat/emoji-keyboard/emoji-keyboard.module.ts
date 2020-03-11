import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { ContentRouterModule } from '@wizdm/content';
import { InkbarModule } from '@wizdm/elements/inkbar';
import { EmojiKeyboard } from './emoji-keyboard.component';

@NgModule({
  declarations: [ EmojiKeyboard ],
  exports: [ EmojiKeyboard ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    InkbarModule,
    ContentRouterModule
  ]
})
export class EmojiKeyboardModule { }
