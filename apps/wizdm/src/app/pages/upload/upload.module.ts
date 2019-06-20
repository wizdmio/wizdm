import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FileOpenModule } from '../../elements/file-open';
import { PopupModule } from '../../elements/popup';
import { ContentResolver } from '../../core';
import { UploadComponent } from './upload.component';

const routes: Routes = [
  {
    path: '',
    component: UploadComponent,
    resolve: { content: ContentResolver }, 
    data: { modules: ['upload'] },
    canActivate: [ ContentResolver ],
    canDeactivate: [ ContentResolver ]
  }
];

@NgModule({
  declarations: [ UploadComponent ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDividerModule,
    MatListModule,
    MatProgressBarModule,
    FileOpenModule,
    PopupModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class UploadModule { }
