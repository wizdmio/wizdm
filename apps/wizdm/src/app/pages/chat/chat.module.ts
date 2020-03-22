import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { GtagModule } from '@wizdm/gtag';
import { RedirectModule } from '@wizdm/redirect';
import { AvatarModule } from '@wizdm/elements/avatar';
//import { IconModule } from '@wizdm/elements/icon';
import { ReadmeModule } from '@wizdm/elements/readme';
import { DialogModule } from '@wizdm/elements/dialog';
import { ActionbarModule } from 'app/navigator/actionbar';
import { AuthGuard } from 'app/utils/auth-guard';
import { CanLeaveModule, CanLeaveGuard } from 'app/utils/can-leave';
import { ViewerModule } from './viewer';
import { ComposerModule } from './composer';
import { ChatComponent } from './chat.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: ['chat', 'emoji-keys'],
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
    ScrollingModule,
    MatButtonModule,
    GtagModule,
    //IconModule, 
    AvatarModule,
    ReadmeModule,
    DialogModule,
    ActionbarModule,
    CanLeaveModule,
    RedirectModule,
    ViewerModule,
    ComposerModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class ChatModule { }
