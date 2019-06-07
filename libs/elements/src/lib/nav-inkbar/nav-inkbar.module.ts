import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InkbarModule } from '../inkbar/inkbar.module';
import { NavInkbarComponent } from './nav-inkbar.component';
import { NavInkbarDirective } from './nav-inkbar.directive';

@NgModule({
  declarations: [NavInkbarComponent, NavInkbarDirective],
  imports: [CommonModule, RouterModule, InkbarModule],
  exports: [NavInkbarComponent, NavInkbarDirective]
})
export class NavInkbarModule {}
