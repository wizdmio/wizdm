import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AvatarModule } from '../../elements/avatar';
import { IconModule } from '../../elements/icon';
import { PopupModule } from '../../elements/popup';
import { ContentResolver } from '../../core';
import { UploadModule } from '../upload/upload.module';
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
    UploadModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class ProfileModule { }
