import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DialogModule } from '@wizdm/dialog';
import { ReadmeModule } from '@wizdm/elements/readme';
import { IconModule } from '@wizdm/elements/icon';
import { ThumbnailModule } from '@wizdm/elements/thumbnail';
import { SpinnerModule } from '@wizdm/elements/spinner';
import { OpenFileModule } from '@wizdm/elements/openfile';
import { FolderComponent } from './folder.component';

@NgModule({
  declarations: [ FolderComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatButtonToggleModule,
    DialogModule,
    ReadmeModule,
    IconModule,
    ThumbnailModule,
    SpinnerModule,
    OpenFileModule
  ],
  exports: [
    FolderComponent
  ]
})
export class FolderModule { }
