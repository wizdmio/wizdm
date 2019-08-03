import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DisclaimerModule } from '../../elements/disclaimer';
import { PopupModule } from '../../elements/popup';
import { ContentResolver } from '../../core/content';
import { ApplyComponent } from './apply.component';

const routes: Routes = [
  {
    path: '',
    component: ApplyComponent,
    resolve: { content: ContentResolver }, 
    data: { i18n: ['apply', 'template'] },
    canActivate: [ ContentResolver ],
    canDeactivate: [ ContentResolver ]
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
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class ApplyModule { }
