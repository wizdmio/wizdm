import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule, MatButtonModule, MatMenuModule } from '@angular/material';
import { ColorsModule } from '../colors/colors.module';
import { ColorPickerComponent } from './color-picker.component';

@NgModule({
  declarations: [ColorPickerComponent],
  imports: [
    CommonModule, 
    FlexLayoutModule,
    MatIconModule, 
    MatButtonModule, 
    MatMenuModule, 
    ColorsModule
  ],
  exports: [ColorPickerComponent]
})
export class ColorPickerModule {}
