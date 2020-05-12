import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { OpenFileModule } from '@wizdm/elements/openfile';
import { ReadmeModule } from '@wizdm/readme';
import { AvatarModule } from '@wizdm/elements/avatar';
import { IconModule } from '@wizdm/elements/icon';
import { ButtonChangerModule } from '@wizdm/elements/button';
import { RedirectModule } from '@wizdm/redirect';
import { DialogModule } from '@wizdm/dialog';
import { GtagModule } from '@wizdm/gtag';
import { CanLeaveModule, CanLeaveGuard } from 'app/pages/guards/can-leave';
import { ActionbarModule } from 'app/navigator/actionbar';
import { UserPhotoComponent } from './user-photo/user-photo.component';
import { UserFormComponent } from './user-form/user-form.component';
import { AuthGuard, loggedIn } from 'app/auth/auth-guard';
import { ProfileComponent } from './profile.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'profile',
    component: ProfileComponent,
    canActivate: [ AuthGuard ], data: { authGuardPipe: loggedIn },
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
    MatProgressBarModule,
    GtagModule,
    IconModule, 
    AvatarModule,
    ReadmeModule,
    DialogModule,
    ButtonChangerModule,
    OpenFileModule,
    ActionbarModule,
    CanLeaveModule,
    RedirectModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class ProfileModule { }
