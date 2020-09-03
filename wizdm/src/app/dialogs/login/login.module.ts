import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { DialogModule } from '@wizdm/elements/dialog';
import { ReadmeModule } from '@wizdm/readme';
import { IconModule } from '@wizdm/elements/icon';
import { LoginComponent } from './login.component';

/** Dialog route. This route will be used by the DialogLoader, emulating the router, to lazily load the dialog */
const routes: RoutesWithContent = [{
  path: '',
  content: 'login',
  component: LoginComponent
}];

@NgModule({

  declarations: [ LoginComponent ],  

  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule, 
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    DialogModule,
    ReadmeModule,
    IconModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class LoginModule { }