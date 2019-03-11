import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TogglerComponent } from './toggler.component';

@NgModule({
  declarations: [TogglerComponent],
  imports: [CommonModule],
  exports: [TogglerComponent]
})
export class TogglerModule {}
