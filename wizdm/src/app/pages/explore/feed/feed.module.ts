import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatButtonModule } from '@angular/material/button';
import { IconModule } from '@wizdm/elements/icon';
import { ButtonChangerModule } from '@wizdm/elements/button';
import { GtagModule } from '@wizdm/gtag';
import { ActionbarModule } from 'app/navigator/actionbar';
import { RedirectModule } from '@wizdm/redirect';
import { ContentRouterModule, RoutesWithContent, ContentModule } from '@wizdm/content';
import { PostModule } from './post/post.module';
import { FeedComponent } from './feed.component';
import { DialogModule } from '@wizdm/elements/dialog';
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
import { FabModule } from 'app/navigator/fab/fab.module';
import { MatDialogModule } from '@angular/material/dialog';


const routes: RoutesWithContent = [
  {
    path: '',
    content: 'explore-feed',
    component: FeedComponent
  }
];

@NgModule({
  declarations: [ FeedComponent],
  imports: [
    CommonModule,
    // ContentModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    EmojiInputModule,
    EmojiMaterialModule,
    EmojiKeyboardModule,
    EmojiImageModule,
    TextareaModule,
    AvatarModule,
    DialogModule,
    IconModule,
    ButtonChangerModule,
    GtagModule,
    ActionbarModule,
    PostModule,
    MatListModule,
    MatDialogModule,
    MatExpansionModule,
    FabModule,
    ContentRouterModule.forChild(routes)
  ],
  providers: []
})
export class FeedModule { }
