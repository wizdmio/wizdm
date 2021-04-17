import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { IconComponent } from './icon.component';

@NgModule({
  declarations: [IconComponent],
  imports: [CommonModule, MatIconModule],  
  exports: [IconComponent, MatIconModule]
})
export class IconModule {}
