import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AvatarModule } from '@wizdm/elements/avatar';
import { IconModule } from '@wizdm/elements/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DialogModule } from '@wizdm/elements/dialog';
import {MatFormFieldModule} from '@angular/material/form-field'; 
import {MatInputModule} from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { EmojiInputModule } from '@wizdm/emoji/input';
import { EmojiMaterialModule } from '@wizdm/emoji/material';
import { EmojiKeyboardModule } from '@wizdm/emoji-keyboard';
import { EmojiImageModule } from '@wizdm/emoji/image';
import { TextareaModule } from 'app/utils/textarea';
import { ContentModule } from '@wizdm/content';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import { AddPostComponent } from './add-post.component';


@NgModule({
    imports: [
        CommonModule,
        ContentModule,
        FlexLayoutModule,
        MatButtonModule,
        MatCardModule,
        AvatarModule,
        IconModule,
        MatListModule,
        DialogModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        EmojiInputModule,
        EmojiMaterialModule,
        EmojiKeyboardModule,
        EmojiImageModule,
        TextareaModule,
        MatExpansionModule
    ],
    exports: [AddPostComponent],
    declarations: [AddPostComponent],
})
export class AddPostModule { }
