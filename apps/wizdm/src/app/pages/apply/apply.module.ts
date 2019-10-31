import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { DisclaimerModule } from '../../elements/disclaimer';
import { PopupModule } from '../../elements/popup';
import { AuthGuard, PageGuard } from '../../utils';
import { ApplyComponent } from './apply.component';

const routes: RoutesWithContent = [
  {
    path: '',
    component: ApplyComponent,
    content: 'apply', 
    canActivate: [ AuthGuard ],
    canDeactivate: [ PageGuard ]
  }
];

@NgModule({
  declarations: [ ApplyComponent ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatStepperModule,
    MatProgressBarModule,
    DisclaimerModule,
    PopupModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class ApplyModule { }
