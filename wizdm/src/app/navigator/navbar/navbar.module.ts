import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NavInkbarModule } from '@wizdm/elements/inkbar';
import { NavbarComponent } from './navbar.component';

@NgModule({
  
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    NavInkbarModule
  ],
  declarations: [
    NavbarComponent
  ],
  exports: [
    NavbarComponent
  ]
})
export class NavbarModule { }
