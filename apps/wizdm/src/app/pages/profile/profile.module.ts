import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { OpenFileModule } from '@wizdm/elements/openfile';
import { ReadmeModule } from '@wizdm/elements/readme';
import { AvatarModule } from '@wizdm/elements/avatar';
import { IconModule } from '@wizdm/elements/icon';
import { RedirectModule } from '@wizdm/redirect';
import { DialogModule } from '@wizdm/dialog';
import { GtagModule } from '@wizdm/gtag';
import { CanLeaveModule, CanLeaveGuard } from 'app/navigator/can-leave';
import { ActionbarModule } from 'app/navigator/actionbar';
import { UserPhotoComponent } from './user-photo/user-photo.component';
import { UserFormComponent } from './user-form/user-form.component';
import { ProfileComponent } from './profile.component';
import { AuthGuard } from 'app/navigator/auth-guard';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'profile',
    component: ProfileComponent,
    canActivate: [ AuthGuard ],
    canDeactivate: [ CanLeaveGuard ]
  }
];

@NgModule({
  declarations: [
    ProfileComponent,
    UserFormComponent,
    UserPhotoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDividerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    GtagModule,
    IconModule, 
    AvatarModule,
    ReadmeModule,
    DialogModule,
    OpenFileModule,
    ActionbarModule,
    CanLeaveModule,
    RedirectModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class ProfileModule { }
