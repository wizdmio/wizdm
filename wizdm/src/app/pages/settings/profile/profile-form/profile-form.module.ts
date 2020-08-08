import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ContentModule } from '@wizdm/content';
import { IconModule } from '@wizdm/elements/icon';
import { ProfileFormComponent } from './profile-form.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    ContentModule,
    IconModule
  ],
  declarations: [ ProfileFormComponent ],
  exports: [ ProfileFormComponent ]
})
export class ProfileFormModule { }
