import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostDialogComponent } from './post-dlg.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatButtonModule } from '@angular/material/button';
import { IconModule } from '@wizdm/elements/icon';
import { ButtonChangerModule } from '@wizdm/elements/button';
import { GtagModule } from '@wizdm/gtag';
import { ActionbarModule } from 'app/navigator/actionbar';
import { MatCardModule } from '@angular/material/card';
import { AvatarModule } from '@wizdm/elements/avatar';
import {MatFormFieldModule} from '@angular/material/form-field'; 
import {MatInputModule} from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { EmojiInputModule } from '@wizdm/emoji/input';
import { EmojiMaterialModule } from '@wizdm/emoji/material';
import { EmojiKeyboardModule } from '@wizdm/emoji-keyboard';
import { EmojiImageModule } from '@wizdm/emoji/image';
import { TextareaModule } from 'app/utils/textarea';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';

/** Dialog route. This route will be used by the DialogLoader, emulating the router, to lazily load the dialog */
const routes: RoutesWithContent = [{
  path: '',
  content: 'explorer-feed-post',
  component: PostDialogComponent,
  data: { dialogConfig: {  maxWidth: '100%' }}
}];


@NgModule({
  declarations: [PostDialogComponent],
  imports: [CommonModule,
    MatDialogModule, 
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatListModule,
    ReactiveFormsModule,
    EmojiInputModule,
    EmojiMaterialModule,
    EmojiKeyboardModule,
    EmojiImageModule,
    TextareaModule,
    AvatarModule,
    FlexLayoutModule,
    MatButtonModule,
    IconModule,
    ButtonChangerModule,
    GtagModule,
    ActionbarModule,
  
    ContentRouterModule.forChild(routes)],
  exports: [],
  providers: [],
})
export class PostModule { }