import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlipComponent } from './flip.component';

@NgModule({
  declarations: [FlipComponent],
  imports: [CommonModule],
  exports: [FlipComponent]
})
export class FlipModule {}
