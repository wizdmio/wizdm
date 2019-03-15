import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatDialogModule,
  MatButtonModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { FileOpenModule } from '@wizdm/elements';
import { UploadsComponent } from './uploads.component';

@NgModule({
  declarations: [
    UploadsComponent
  ],
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
