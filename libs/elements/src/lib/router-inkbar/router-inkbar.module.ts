import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InkbarModule } from '../inkbar/inkbar.module';
import { RouterInkbarComponent } from './router-inkbar.component';

@NgModule({
  declarations: [ RouterInkbarComponent ],
  imports: [ CommonModule, RouterModule, InkbarModule],
  exports: [ RouterInkbarComponent ]
})
export class NavInkbarModule {}
