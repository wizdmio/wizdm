import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { AnimateModule } from '@wizdm/animate';
import { TeleportModule } from '@wizdm/teleport';
import { LogoModule } from '@wizdm/elements/logo';
import { TogglerModule } from '@wizdm/elements/toggler';
import { IconModule } from '@wizdm/elements/icon';
import { AvatarModule } from '@wizdm/elements/avatar';
import { FlipModule } from '@wizdm/elements/flip';
import { ActionLinkModule } from '@wizdm/actionlink';
import { LoginModule } from 'app/dialogs/login/login.module';
import { FeedbackModule } from 'app/dialogs/feedback/feedback.module';
import { TitleModule } from './title/title.module';
import { NavbarModule } from './navbar/navbar.module'; 
import { ActionbarModule } from './actionbar/actionbar.module'; 
import { MenuModule } from './menu/menu.module'; 
import { FooterModule } from './footer/footer.module';
import { NavRoutingModule } from './navigator-routing.module';
import { NavigatorComponent } from './navigator.component';

@NgModule({
  declarations: [ NavigatorComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ScrollingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    AnimateModule,
    TeleportModule,
    TogglerModule,
    LogoModule,
    IconModule, 
    AvatarModule,
    FlipModule,
    ActionLinkModule,
    LoginModule,
    FeedbackModule,
    TitleModule,
    NavbarModule,
    ActionbarModule,
    MenuModule,
    FooterModule,
    NavRoutingModule
  ]
})
export class NavigatorModule { }
