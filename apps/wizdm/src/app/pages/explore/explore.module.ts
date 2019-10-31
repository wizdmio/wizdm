import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout'
import { ReactiveFormsModule } from '@angular/forms';;
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { ThumbnailModule } from '../../elements/thumbnail';
import { AvatarModule } from '../../elements/avatar';
import { IconModule } from '../../elements/icon';
import { AuthGuard, PageGuard } from '../../utils';
import { UserInfoModule } from '../user-info/user-info.module';
import { UploadModule } from '../upload/upload.module';
import { ExploreComponent } from './explore.component';
import { ProjectComponent } from './project/project.component';

const routes: RoutesWithContent = [
  {
    path: '',
    component: ExploreComponent,
    content: 'explore',
    //canActivate: [ AuthGuard ],
    canDeactivate: [ PageGuard ]
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
    ThumbnailModule,
    AvatarModule, 
    IconModule,
    UserInfoModule,
    UploadModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class ExploreModule { }
