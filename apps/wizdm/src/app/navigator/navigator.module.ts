import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// Angular material + Flex layout
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TogglerModule } from '../elements/toggler';
import { IconModule } from '../elements/icon';
import { FlipModule } from '../elements/flip';
import { AvatarModule } from '../elements/avatar';
import { NavInkbarModule } from '../elements/nav-inkbar';
import { NavComponent } from './navigator.component';
import { LogoComponent } from './logo/logo.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ActionComponent } from './toolbar/action/action.component';
import { MenuComponent } from './menu/menu.component';
import { ErrorsComponent } from './errors/errors.component';
import { FooterComponent } from './footer/footer.component';
//-- Shared Components ----


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule,
    TogglerModule,
    IconModule, 
    FlipModule,
    AvatarModule,
    NavInkbarModule,
  ],
  declarations: [
    NavComponent,
    LogoComponent,
    NavbarComponent,
    ToolbarComponent,
    ActionComponent,
    MenuComponent,
    FooterComponent,
    ErrorsComponent
  ],
  providers: []
})
export class NavigatorModule { }
