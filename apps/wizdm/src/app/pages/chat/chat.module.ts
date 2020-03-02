import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
//import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
//import { MatDatepickerModule } from '@angular/material/datepicker';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { GtagModule } from '@wizdm/gtag';
import { RedirectModule } from '@wizdm/redirect';
import { EmojiImageModule } from '@wizdm/emoji/image';
import { EmojiTextModule } from '@wizdm/emoji/text';
import { EmojiInputModule } from '@wizdm/emoji/input';
import { EmojiMaterialModule } from '@wizdm/emoji/material';
import { AvatarModule } from '@wizdm/elements/avatar';
import { IconModule } from '@wizdm/elements/icon';
import { ReadmeModule } from '@wizdm/elements/readme';
import { ActionbarModule } from 'app/navigator/actionbar';
import { AuthGuard } from 'app/utils/auth-guard';
import { CanLeaveModule, CanLeaveGuard } from 'app/utils/can-leave';
import { ChatComponent } from './chat.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'chat',
    component: ChatComponent,
    canActivate: [ AuthGuard ],
    canDeactivate: [ CanLeaveGuard ]
  }
];

@NgModule({
  declarations: [ ChatComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    GtagModule,
    IconModule, 
    AvatarModule,
    ReadmeModule,
    ActionbarModule,
    CanLeaveModule,
    RedirectModule,
    EmojiImageModule,
    EmojiTextModule,
    EmojiInputModule,
    EmojiMaterialModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class ChatModule { }
