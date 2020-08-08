import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { RedirectModule } from '@wizdm/redirect';
import { GtagModule } from '@wizdm/gtag';
import { IconModule } from '@wizdm/elements/icon';
import { ButtonChangerModule } from '@wizdm/elements/button';
import { PipesModule } from '@wizdm/connect/database/pipes';
import { ReadmeModule } from '@wizdm/readme';
import { AvatarModule } from '@wizdm/elements/avatar';
import { BalloonModule } from '@wizdm/elements/balloon';
import { DialogModule } from '@wizdm/elements/dialog';
import { TeleportModule } from '@wizdm/teleport';
import { ActionbarModule } from 'app/navigator/actionbar';
import { SidenavModule } from 'app/navigator/sidenav';
import { ToolbarModule } from 'app/navigator/toolbar';
import { StickyFooterModule } from 'app/navigator/footer';
import { FabModule } from 'app/navigator/fab';
import { MomentPipesModule } from '@wizdm/pipes/moment';
import { CanLeaveModule, CanLeaveGuard } from 'app/utils/can-leave';
import { AuthGuard, emailVerified } from 'app/utils/auth-guard';
import { ValidProfile } from 'app/utils/user';
import { ConversationModule } from './conversation';
import { MessageModule } from './message';
import { ComposerModule } from './composer';
import { ChatService } from './chat.service';
import { ChatComponent } from './chat.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: ['chat', 'emoji-keys'],
    component: ChatComponent,
    canActivate: [ AuthGuard, ValidProfile, ChatService ], data: { authGuardPipe: emailVerified },
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
    MatDividerModule,
    MatProgressSpinnerModule,
    RedirectModule,
    PipesModule,
    GtagModule,
    IconModule, 
    ButtonChangerModule,
    ReadmeModule,
    AvatarModule,
    BalloonModule,
    DialogModule,
    TeleportModule,
    ActionbarModule,
    SidenavModule,
    ToolbarModule,
    StickyFooterModule,
    FabModule,
    MomentPipesModule,
    CanLeaveModule,
    ConversationModule,
    MessageModule,
    ComposerModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class ChatModule { }
