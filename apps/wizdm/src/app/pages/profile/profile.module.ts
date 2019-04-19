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
import { IconModule, AvatarModule, PopupModule } from '@wizdm/elements';
import { ContentResolver } from '../../utils';
import { UploadsModule } from '../uploads/uploads.module';
import { UserComponent } from './profile.component';
import { UserItemComponent } from './item/item.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    resolve: { content: ContentResolver }, 
    data: { modules: ['profile'] },
    canActivate: [ ContentResolver ],
    canDeactivate: [ ContentResolver ]
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
    PopupModule,
    UploadsModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class ProfileModule { }
