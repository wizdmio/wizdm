import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// Angular material + Flex layout
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatToolbarModule
} from '@angular/material';
// Wizdm elements (wizdm material extension)
import { 
  TogglerModule,
  IconModule, 
  FlipModule,
  AvatarModule,
  NavInkbarModule
} from '@wizdm/elements';
//-------
import { NavComponent } from './navigator.component';
import { LogoComponent } from './logo/logo.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ActionComponent } from './toolbar/action/action.component';
import { MenuComponent } from './menu/menu.component';
import { ErrorsComponent } from './errors/errors.component';
import { FooterComponent } from './footer/footer.component';

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
    NavInkbarModule
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
