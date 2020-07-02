import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { GtagModule } from '@wizdm/gtag';
import { DialogModule } from '@wizdm/dialog';
import { ReadmeModule } from '@wizdm/readme';
import { IconModule } from '@wizdm/elements/icon';
import { ButtonChangerModule } from '@wizdm/elements/button';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { CanLeaveModule, CanLeaveGuard } from 'app/utils/can-leave';
import { ActionbarModule } from 'app/navigator/actionbar';
import { UserPhotoModule } from './user-photo/user-photo.module';
import { UserFormModule } from './user-form/user-form.module';
import { ProfileComponent } from './profile.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'settings/profile',
    component: ProfileComponent,
    canDeactivate: [ CanLeaveGuard ]
  }
];

@NgModule({
  declarations: [ ProfileComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatDividerModule,
    MatButtonModule,
    GtagModule,
    DialogModule,
    ReadmeModule,
    IconModule,
    ButtonChangerModule,
    CanLeaveModule,
    ActionbarModule,
    UserFormModule,
    UserPhotoModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class ProfileModule { }
