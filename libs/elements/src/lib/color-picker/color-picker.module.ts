import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatMenuModule } from '@angular/material';
import { ColorsModule } from '../colors/colors.module';
import { ColorPickerComponent } from './color-picker.component';

@NgModule({
  declarations: [ColorPickerComponent],
  imports: [CommonModule, MatIconModule, MatMenuModule, ColorsModule],
  exports: [ColorPickerComponent]
})
export class ColorPickerModule {}
