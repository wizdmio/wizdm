import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileSizePipe } from './file-size.pipe';
import { FileOpenComponent } from './file-open.component';
import { FileDropDirective } from './file-drop.directive';

@NgModule({
  declarations: [FileSizePipe, FileOpenComponent, FileDropDirective],
  imports: [CommonModule],
  exports: [FileSizePipe, FileOpenComponent, FileDropDirective]
})
export class FileOpenModule {}
