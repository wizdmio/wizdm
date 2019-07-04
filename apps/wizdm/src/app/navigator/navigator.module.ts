import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { TogglerModule } from '../elements/toggler';
import { IconModule } from '../elements/icon';
import { FlipModule } from '../elements/flip';
import { AvatarModule } from '../elements/avatar';
import { LogoModule } from './logo/logo.module';
import { NavbarModule } from './navbar/navbar.module'; 
import { ToolbarModule } from './toolbar/toolbar.module'; 
import { MenuModule } from './menu/menu.module'; 
import { ErrorsModule } from './errors/errors.module'; 
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
    IconModule, 
    FlipModule,
    AvatarModule,
    LogoModule,
    NavbarModule,
    ToolbarModule,
    MenuModule,
    ErrorsModule,
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
