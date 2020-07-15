import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContentModule } from '@wizdm/content';
import { IconModule } from '@wizdm/elements/icon';
import { EmojiInputModule } from '@wizdm/emoji/input';
import { EmojiMaterialModule } from '@wizdm/emoji/material';
import { EmojiKeyboardModule } from '@wizdm/emoji-keyboard';
import { TextareaModule } from 'app/utils/textarea';
import { MessageComposer } from './composer.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule, 
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatTooltipModule,
    EmojiInputModule,
    EmojiMaterialModule,
    EmojiKeyboardModule,
    ContentModule,
    IconModule,
    TextareaModule
  ],
  declarations: [ MessageComposer ],
  exports: [ MessageComposer ]
})
export class ComposerModule { }
