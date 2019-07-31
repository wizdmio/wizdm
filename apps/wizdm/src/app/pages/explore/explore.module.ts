import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout'
import { ReactiveFormsModule } from '@angular/forms';;
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
//import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ThumbnailModule } from '../../elements/thumbnail';
import { AvatarModule } from '../../elements/avatar';
import { LikesModule } from '../../elements/likes';
import { IconModule } from '../../elements/icon';
import { ContentResolver } from '../../core';
import { UserInfoModule } from '../user-info/user-info.module';
import { UploadModule } from '../upload/upload.module';
import { ExploreComponent } from './explore.component';
import { ProjectComponent } from './project/project.component';

const routes: Routes = [
  {
    path: '',
    component: ExploreComponent,
    resolve: { content: ContentResolver }, 
    data: { i18n: ['explore'] },
    //canActivate: [ ContentResolver ],
    canDeactivate: [ ContentResolver ]
  }
];

@NgModule({
  declarations: [ 
    ExploreComponent, 
    ProjectComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    //MatProgressSpinnerModule,
    ThumbnailModule,
    AvatarModule, 
    IconModule, 
    LikesModule,
    UserInfoModule,
    UploadModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class ExploreModule { }
