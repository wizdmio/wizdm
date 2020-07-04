import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { RedirectModule } from '@wizdm/redirect';
import { GtagModule } from '@wizdm/gtag';
import { IconModule } from '@wizdm/elements/icon';
import { ReadmeModule } from '@wizdm/readme';
import { DialogModule } from '@wizdm/dialog';
import { EmojiTextModule } from '@wizdm/emoji/text';
import { BalloonModule } from '@wizdm/elements/balloon';
import { MomentPipesModule } from '@wizdm/pipes/moment';
import { ActionbarModule } from 'app/navigator/actionbar';
import { SidenavModule } from 'app/navigator/sidenav';
import { StickyFooterModule } from 'app/navigator/footer';
import { FabModule } from 'app/navigator/fab';
import { CanLeaveModule, CanLeaveGuard } from 'app/utils/can-leave';
import { AuthGuard, emailVerified } from 'app/utils/auth-guard';
import { ValidProfile } from 'app/utils/user-profile';
import { ConversationModule } from './conversation';
import { ComposerModule } from './composer';
import { ChatComponent } from './chat.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: ['chat', 'chat/emoji-keys'],
    component: ChatComponent,
    canActivate: [ AuthGuard, ValidProfile ], data: { authGuardPipe: emailVerified },
    canDeactivate: [ CanLeaveGuard ]
  }
];

@NgModule({
  declarations: [ ChatComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatBadgeModule,
    RedirectModule,
    GtagModule,
    IconModule, 
    ReadmeModule,
    DialogModule,
    EmojiTextModule,
    BalloonModule,
    MomentPipesModule,
    ActionbarModule,
    SidenavModule,
    StickyFooterModule,
    FabModule,
    CanLeaveModule,
    ConversationModule,
    ComposerModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class ChatModule { }
