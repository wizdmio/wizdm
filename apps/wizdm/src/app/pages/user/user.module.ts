import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatIconModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatExpansionModule,
  MatListModule,
  MatCheckboxModule,
  MatSelectModule,
  MatDatepickerModule
} from '@angular/material';
import { IconModule, AvatarModule } from '@wizdm/elements';
import { ContentResolver, 
         AuthGuardService, 
         PageGuardService } from '../../utils';
import { UploadsModule } from '../uploads/uploads.module';
import { UserComponent } from './user.component';
import { UserItemComponent } from './user-item/user-item.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    resolve: { content: ContentResolver }, 
    data: { modules: ['profile', 'uploads'] },
    canActivate: [ AuthGuardService ],
    canDeactivate: [ PageGuardService ]
  }
];

@NgModule({
  declarations: [
    UserComponent,
    UserItemComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatListModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    IconModule, 
    AvatarModule,
    UploadsModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class UserModule { }
