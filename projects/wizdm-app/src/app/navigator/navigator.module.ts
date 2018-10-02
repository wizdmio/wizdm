import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
//-------
import { ElementsModule } from '../elements/elements.module';
import { NavComponent } from './navigator.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LogoComponent as ToolbarLogo } from './toolbar/logo/logo.component';
import { InkbarComponent } from './toolbar/inkbar/inkbar.component';
import { ActionComponent as ToolbarAction } from './toolbar/action/action.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { ScrollViewDirective } from './scroll-view/scroll-view.directive';
import { ConsentComponent } from './consent/consent.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ElementsModule
  ],
  declarations: [
    NavComponent,
    ToolbarComponent,
    ToolbarLogo,
    InkbarComponent,
    ToolbarAction,
    MenuComponent,
    FooterComponent,
    ScrollViewDirective,
    ConsentComponent
  ],
  providers: [/* Using tree-shakable providers
    ToolbarService,
    ScrollViewService*/
  ]
})
export class NavigatorModule { }
