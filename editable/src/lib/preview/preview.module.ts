import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewImageDirective } from './preview-image.directive';
import { PreviewTextComponent } from './preview-text.component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [
    PreviewImageDirective,
    PreviewTextComponent
  ],
  exports: [
    PreviewImageDirective,
    PreviewTextComponent
  ]
})
export class PreviewModule { }
