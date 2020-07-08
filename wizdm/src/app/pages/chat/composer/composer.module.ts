import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { EmojiInputModule } from '@wizdm/emoji/input';
import { EmojiMaterialModule } from '@wizdm/emoji/material';
import { EmojiKeyboardModule } from 'app/utils/emoji-keyboard';
import { TextareaModule } from 'app/utils/textarea';
import { MessageComposer } from './composer.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule, 
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule,
    EmojiInputModule,
    EmojiMaterialModule,
    EmojiKeyboardModule,
    TextareaModule
  ],
  declarations: [ MessageComposer ],
  exports: [ MessageComposer ]
})
export class ComposerModule { }
