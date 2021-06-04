import { NgModule } from '@angular/core';
import { FileDialogDirective } from './file-dialog.directive';

@NgModule({
  declarations: [ FileDialogDirective ],  
  exports: [ FileDialogDirective ]
})
export class FileDialogModule { 
}
