import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorsDirective } from './colors.directive';

@NgModule({
  declarations: [ColorsDirective],
  imports: [CommonModule],
  exports: [ColorsDirective]
})
export class ColorsModule {}
