import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FileOpenModule } from '../../elements/file-open';
import { UploadsComponent } from './uploads.component';

@NgModule({
  declarations: [ UploadsComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FileOpenModule
  ],
  exports: [
    UploadsComponent
  ]
})
export class UploadsModule { }
