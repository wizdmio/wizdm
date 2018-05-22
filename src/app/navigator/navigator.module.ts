import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatToolbarModule,
  MatSidenavModule,
  MatMenuModule,
  MatListModule,
  MatButtonModule,
  MatSelectModule,
  MatIconModule,
  MatDividerModule
} from '@angular/material';

import { NavComponent } from './navigator.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { TogglerComponent } from './toolbar/toggler/toggler.component';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    //MatMenuModule,
    MatListModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule
  ],
  declarations: [
    NavComponent,
    ToolbarComponent,
    TogglerComponent,
    FooterComponent
  ],
  providers: [
  ]
})
export class NavigatorModule { }
