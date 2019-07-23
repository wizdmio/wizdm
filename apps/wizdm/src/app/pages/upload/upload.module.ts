import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { IconModule } from '../../elements/icon';
import { ThumbnailModule } from '../../elements/thumbnail';
import { SpinnerModule } from '../../elements/spinner';
import { FileOpenModule } from '../../elements/openfile';
import { UploadComponent } from './upload.component';

@NgModule({
  declarations: [ UploadComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    IconModule,
    ThumbnailModule,
    SpinnerModule,
    FileOpenModule
  ],
  exports: [
    UploadComponent
  ]
})
export class UploadModule { }
