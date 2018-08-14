import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
//-------
import { SharedModule } from '../shared/shared.module';
import { NavComponent } from './navigator.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ToolbarService } from './toolbar/toolbar.service';
import { LogoComponent as ToolbarLogo } from './toolbar/logo/logo.component';
import { TogglerComponent as ToolbarToggler } from './toolbar/toggler/toggler.component';
import { ActionComponent as ToolbarAction } from './toolbar/action/action.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { FooterComponent } from './footer/footer.component';
import { ScrollViewDirective } from './scroll-view/scroll-view.directive';
import { ScrollViewService } from './scroll-view/scroll-view.service';
/*
import { 
  NavComponent, 
  ToolbarComponent, 
  ToolbarService,
  LogoComponent, 
  TogglerComponent,
  SideMenuComponent,
  FooterComponent,
  ScrollViewDirective 
} from '.';*/

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    NavComponent,
    ToolbarComponent,
    ToolbarLogo,
    ToolbarToggler,
    ToolbarAction,
    SideMenuComponent,
    FooterComponent,
    ScrollViewDirective
  ],
  providers: [
    ToolbarService,
    ScrollViewService
  ]
})
export class NavigatorModule { }
