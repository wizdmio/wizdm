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
  MatDialogModule,
  MatToolbarModule,
  MatSelectModule
} from '@angular/material';
// Wizdm elements (wizdm material extension)
import { 
  TogglerModule,
  IconModule, 
  FlipModule,
  AvatarModule,
  InkbarModule,
  RouterInkbarModule,
  DisclaimerModule
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
import { ConsentComponent } from './consent/consent.component';

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
    MatDialogModule,
    MatToolbarModule,
    MatSelectModule,
    TogglerModule,
    IconModule, 
    FlipModule,
    AvatarModule,
    InkbarModule,
    RouterInkbarModule,
    DisclaimerModule
  ],
  declarations: [
    NavComponent,
    LogoComponent,
    NavbarComponent,
    ToolbarComponent,
    ActionComponent,
    MenuComponent,
    FooterComponent,
    ConsentComponent,
    ErrorsComponent,
  ],
  providers: []
})
export class NavigatorModule { }
