import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InkbarModule } from '../inkbar/inkbar.module';
import { RouterInkbarComponent } from './router-inkbar.component';
import { RouterInkbarDirective } from './router-inkbar.directive';

@NgModule({
  declarations: [RouterInkbarComponent, RouterInkbarDirective],
  imports: [CommonModule, RouterModule, InkbarModule],
  exports: [RouterInkbarComponent, RouterInkbarDirective]
})
export class NavInkbarModule {}
