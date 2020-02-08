import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { IconComponent } from './icon.component';

@NgModule({
  imports: [CommonModule, MatIconModule],
  declarations: [IconComponent],
  exports: [IconComponent]
})
export class IconModule {}
