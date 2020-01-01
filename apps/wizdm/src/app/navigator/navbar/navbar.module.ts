import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NavInkbarModule } from '@wizdm/elements/router-inkbar';
import { NavbarComponent } from './navbar.component';

@NgModule({
  
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
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
