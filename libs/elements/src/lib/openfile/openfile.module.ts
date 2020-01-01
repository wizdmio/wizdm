import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenFileComponent } from './openfile.component';
import { FileSizePipe } from './utils/file-size.pipe';
import { FileDropDirective } from './utils/file-drop.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [OpenFileComponent, FileSizePipe, FileDropDirective],
  exports: [OpenFileComponent, FileSizePipe, FileDropDirective]
})
export class OpenFileModule {}
