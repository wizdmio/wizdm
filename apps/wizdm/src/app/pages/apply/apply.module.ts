import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatCheckboxModule,
  MatStepperModule,
  MatProgressBarModule
} from '@angular/material';
import { DisclaimerModule } from '@wizdm/elements';
import { ContentResolver, 
         AuthGuardService, 
         PageGuardService } from '../../utils';
import { ApplyComponent } from './apply.component';

const routes: Routes = [
  {
    path: '',
    component: ApplyComponent,
    resolve: { content: ContentResolver }, 
    data: { modules: ['apply', 'terms', 'template'] },
    canActivate: [ AuthGuardService ],
    canDeactivate: [ PageGuardService ]
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
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class ApplyModule { }
