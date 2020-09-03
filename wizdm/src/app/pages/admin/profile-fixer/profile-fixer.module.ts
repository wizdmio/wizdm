import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { IconModule } from '@wizdm/elements/icon';
import { ReadmeModule } from '@wizdm/readme';
import { DialogModule } from '@wizdm/elements/dialog';
import { ButtonChangerModule } from '@wizdm/elements/button';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { CanLeaveModule, CanLeaveGuard } from 'app/utils/can-leave';
import { ActionbarModule } from 'app/navigator/actionbar';
import { ProfileFixerComponent } from './profile-fixer.component';

const routes: RoutesWithContent = [{

  path: '',
  content: 'admin-fixer',
  component: ProfileFixerComponent,
  canDeactivate: [ CanLeaveGuard ]

}];

@NgModule({
  declarations: [ ProfileFixerComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatProgressBarModule,
    IconModule,
    ReadmeModule,
    DialogModule,
    ButtonChangerModule,
    ActionbarModule,
    CanLeaveModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class ProfileFixerModule { }
