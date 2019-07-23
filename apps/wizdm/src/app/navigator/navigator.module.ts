import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { LogoModule } from '../elements/logo';
import { TogglerModule } from '../elements/toggler';
import { IconModule } from '../elements/icon';
import { AvatarModule } from '../elements/avatar';
import { FlipModule } from '../elements/flip';
import { NavbarModule } from './navbar/navbar.module'; 
import { ToolbarModule } from './toolbar/toolbar.module'; 
import { MenuModule } from './menu/menu.module'; 
import { NotifyModule } from './notify/notify.module'; 
import { FooterModule } from './footer/footer.module';
import { FeedbackModule } from './feedback/feedback.module';
import { NavigatorComponent } from './navigator.component';
import { NavigatorService } from './navigator.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    TogglerModule,
    LogoModule,
    IconModule, 
    FlipModule,
    AvatarModule,
    NavbarModule,
    ToolbarModule,
    MenuModule,
    NotifyModule,
    FooterModule,
    FeedbackModule
  ],
  declarations: [ 
    NavigatorComponent
  ],
  exports: [
    NavigatorComponent
  ],
  providers: [
    NavigatorService
  ]
})
export class NavigatorModule { }
