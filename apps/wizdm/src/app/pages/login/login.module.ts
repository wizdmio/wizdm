import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { IconModule } from '../../elements/icon';
import { LinkModule } from '../../elements/link';
import { AuthGuard, PageGuard } from '../../utils';
import { LoginComponent } from './login.component';

const routes: RoutesWithContent = [
  {
    path: '',
    component: LoginComponent,
    content: 'login',
    //canActivate: [ AuthGuard ],
    canDeactivate: [ PageGuard ]
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
    ContentRouterModule.forChild(routes)
  ]
})
export class LoginModule { }
