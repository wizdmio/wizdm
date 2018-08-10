import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
//-------
import { SharedModule } from '../shared/shared.module';
import { NavComponent } from './navigator.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ToolbarService } from './toolbar/toolbar.service';
import { LogoComponent } from './toolbar/logo/logo.component';
import { TogglerComponent } from './toolbar/toggler/toggler.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { FooterComponent } from './footer/footer.component';
import { ScrollViewDirective } from './scroll-view/scroll-view.directive';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    NavComponent,
    ToolbarComponent,
    LogoComponent,
    TogglerComponent,
    SideMenuComponent,
    FooterComponent,
    ScrollViewDirective
  ],
  providers: [
    ToolbarService
  ]
})
export class NavigatorModule { }
