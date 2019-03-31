import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule,
         MatListModule,
         MatProgressBarModule } from '@angular/material';
import { FileOpenModule,PopupModule } from '@wizdm/elements';
import { ContentResolver } from '../../utils';
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
