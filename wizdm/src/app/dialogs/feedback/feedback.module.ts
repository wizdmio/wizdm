import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ContentModule } from '@wizdm/content';
import { RedirectModule } from '@wizdm/redirect';
import { DialogModule } from '@wizdm/elements/dialog';
import { IconModule } from '@wizdm/elements/icon';
import { DoorbellModule } from '@wizdm/doorbell';
import { FeedbackComponent } from './feedback.component';

// Environment
import { environment } from 'env/environment';
const  { doorbell } = environment;

@NgModule({

  providers: [ { provide: 'dialog', useValue: FeedbackComponent }],

  declarations: [ FeedbackComponent ],

  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    ContentModule,
    RedirectModule,
    DialogModule,
    IconModule,
    // Initialize the doorbell service
    DoorbellModule.init(doorbell)
  ]
})
export class FeedbackModule { }
