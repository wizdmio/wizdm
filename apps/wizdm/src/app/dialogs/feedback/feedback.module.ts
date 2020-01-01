import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ContentModule } from '@wizdm/content';
import { RedirectModule } from '@wizdm/redirect';
import { DialogModule } from '@wizdm/elements/dialog';
import { IconModule } from '@wizdm/elements/icon';
import { FeedbackComponent } from './feedback.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    ContentModule,
    RedirectModule,
    DialogModule,
    IconModule
  ],
  declarations: [ FeedbackComponent ],
  exports: [ FeedbackComponent ]
})
export class FeedbackModule { }
