import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './dialog.component';

@NgModule({
  imports: [ MatDialogModule ],
  declarations: [ DialogComponent ],
  exports: [ MatDialogModule, DialogComponent ]
})
export class DialogModule { }