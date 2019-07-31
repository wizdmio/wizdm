import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { FooterModule } from './footer/footer.module';
import { FeedbackModule } from './feedback/feedback.module';
import { NavRoutingModule } from './navigator-routing.module';
import { NavigatorComponent } from './navigator.component';

@NgModule({
  declarations: [ NavigatorComponent ],
  imports: [
    CommonModule,
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
    FooterModule,
    FeedbackModule,
    NavRoutingModule
  ]
})
export class NavigatorModule { }
