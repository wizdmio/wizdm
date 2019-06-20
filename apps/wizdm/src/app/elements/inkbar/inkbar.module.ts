import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InkbarComponent } from './inkbar.component';

@NgModule({
  declarations: [InkbarComponent],
  imports: [CommonModule],
  exports: [InkbarComponent]
})
export class InkbarModule {}
