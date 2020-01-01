import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { LogoModule } from '@wizdm/elements/logo';
import { TogglerModule } from '@wizdm/elements/toggler';
import { IconModule } from '@wizdm/elements/icon';
import { AvatarModule } from '@wizdm/elements/avatar';
import { FlipModule } from '@wizdm/elements/flip';
import { ActionLinkModule } from 'app/utils/action-link';
import { LoginModule } from 'app/dialogs/login/login.module';
import { FeedbackModule } from 'app/dialogs/feedback/feedback.module';
import { NavbarModule } from './navbar/navbar.module'; 
import { ActionbarModule } from './actionbar/actionbar.module'; 
import { MenuModule } from './menu/menu.module'; 
import { FooterModule } from './footer/footer.module';
import { NavRoutingModule } from './navigator-routing.module';
import { NavigatorComponent } from './navigator.component';
import { TitleDirective } from './title/title.directive';

@NgModule({
  declarations: [ NavigatorComponent, TitleDirective ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    TogglerModule,
    LogoModule,
    IconModule, 
    AvatarModule,
    FlipModule,
    ActionLinkModule,
    LoginModule,
    FeedbackModule,
    NavbarModule,
    ActionbarModule,
    MenuModule,
    FooterModule,
    NavRoutingModule
  ]
})
export class NavigatorModule { }
