import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { RedirectModule } from '@wizdm/redirect';
import { GtagModule } from '@wizdm/gtag';
import { AvatarModule } from '@wizdm/elements/avatar';
import { IconModule } from '@wizdm/elements/icon';
import { ReadmeModule } from '@wizdm/readme';
import { DialogModule } from '@wizdm/dialog';
import { ActionbarModule } from 'app/navigator/actionbar';
import { SidenavModule } from 'app/navigator/sidenav';
import { CanLeaveModule, CanLeaveGuard } from 'app/pages/guards/can-leave';
import { AuthGuard, emailVerified } from 'app/pages/guards/auth-guard';
import { ValidProfile } from 'app/pages/guards/valid-profile';
import { ChatConversationModule } from './conversation';
import { ChatMessageModule } from './message';
import { ChatComposerModule } from './composer';
import { ChatComponent } from './chat.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: ['chat', 'emoji-keys'],
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
    ScrollingModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatBadgeModule,
    RedirectModule,
    GtagModule,
    IconModule, 
    AvatarModule,
    ReadmeModule,
    DialogModule,
    ActionbarModule,
    SidenavModule,
    //ScrollModule,
    CanLeaveModule,
    ChatConversationModule,
    ChatMessageModule,
    ChatComposerModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class ChatModule { }
