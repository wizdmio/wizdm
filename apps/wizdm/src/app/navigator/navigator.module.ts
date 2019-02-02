import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// Angular material + Flex layout
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  //MatButtonToggleModule,
  MatIconModule,
  MatMenuModule,
  //MatBadgeModule,
  MatFormFieldModule,
  MatInputModule,
  //MatStepperModule,
  //MatExpansionModule,
  MatListModule,
  //MatGridListModule,
  //MatCheckboxModule,
  //MatProgressBarModule,
  //MatProgressSpinnerModule,
  MatDialogModule,
  MatToolbarModule,
  MatSelectModule,
  //MatDividerModule,
  //MatTooltipModule,
} from '@angular/material';
//-------
import { ElementsModule } from '../elements/elements.module';
import { NavComponent } from './navigator.component';
import { LogoComponent } from './logo/logo.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ActionComponent } from './toolbar/action/action.component';
import { MenuComponent } from './menu/menu.component';
import { ErrorsComponent } from './errors/errors.component';
import { FooterComponent } from './footer/footer.component';
import { FitViewportDirective } from './viewport/fit-viewport.directive';
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
    ElementsModule
  ],
  declarations: [
    NavComponent,
    LogoComponent,
    NavbarComponent,
    ToolbarComponent,
    ActionComponent,
    MenuComponent,
    FooterComponent,
    FitViewportDirective,
    ConsentComponent,
    ErrorsComponent,
  ],
  providers: []
})
export class NavigatorModule { }
