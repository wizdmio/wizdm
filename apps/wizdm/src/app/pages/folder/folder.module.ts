import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FileOpenModule } from '../../elements/openfile';
import { PopupModule } from '../../elements/popup';
import { ContentResolver } from '../../core';
import { FolderComponent } from './folder.component';

const routes: Routes = [
  {
    path: '',
    component: FolderComponent,
    resolve: { content: ContentResolver }, 
    data: { modules: ['folder'] },
    canActivate: [ ContentResolver ],
    canDeactivate: [ ContentResolver ]
  }
];

@NgModule({
  declarations: [ FolderComponent ],
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
export class FolderModule { }
