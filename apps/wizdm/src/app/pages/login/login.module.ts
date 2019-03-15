import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressBarModule
} from '@angular/material';
import { IconModule } from '@wizdm/elements';
import { ContentResolver, PageGuardService } from '../../utils';
import { LoginComponent } from './login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    resolve: { content: ContentResolver }, 
    data: { modules: ['login'] }
  }
];

@NgModule({
  declarations: [ LoginComponent ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    IconModule, 
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class LoginModule { }
