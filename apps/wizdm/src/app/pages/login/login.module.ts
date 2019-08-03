import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { IconModule } from '../../elements/icon';
import { LinkModule } from '../../elements/link';
import { ContentResolver } from '../../core/content';
import { LoginComponent } from './login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    resolve: { content: ContentResolver }, 
    data: { i18n: ['login'] },
    //canActivate: [ ContentResolver ],
    canDeactivate: [ ContentResolver ]
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
    LinkModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class LoginModule { }
