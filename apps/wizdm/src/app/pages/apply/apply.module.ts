import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { DialogModule } from '@wizdm/elements/dialog';
import { ReadmeModule } from '@wizdm/elements/readme';
import { TeleportModule } from '@wizdm/teleport';
import { ActionbarModule } from 'app/navigator/actionbar';
import { AuthGuard } from 'app/utils/auth-guard';
import { CanLeaveModule, CanLeaveGuard } from 'app/utils/can-leave';
import { ApplyComponent } from './apply.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'apply', 
    component: ApplyComponent,
    canActivate: [ AuthGuard ],
    canDeactivate: [ CanLeaveGuard ]
  }
];

@NgModule({
  declarations: [ ApplyComponent ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatStepperModule,
    MatProgressBarModule,
    ReadmeModule,
    TeleportModule,
    ActionbarModule,
    CanLeaveModule,
    DialogModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class ApplyModule { }
