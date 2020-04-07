import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InkbarModule } from '../inkbar/inkbar.module';
import { InkbarDirective } from '../inkbar/inkbar.directive';
import { RouterInkbarComponent } from './router-inkbar.component';
import { RouterInkbarDirective } from './router-inkbar.directive';

@NgModule({
  imports: [ CommonModule, RouterModule, InkbarModule ],
  declarations: [ RouterInkbarComponent, RouterInkbarDirective ],
  exports: [ RouterInkbarComponent, RouterInkbarDirective, InkbarDirective ]
})
export class NavInkbarModule {}
