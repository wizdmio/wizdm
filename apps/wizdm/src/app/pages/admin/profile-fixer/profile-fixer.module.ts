import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { IconModule } from '@wizdm/elements/icon';
import { ButtonChangerModule } from '@wizdm/elements/button';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { ActionbarModule } from 'app/navigator/actionbar';
import { ProfileFixerComponent } from './profile-fixer.component';

const routes: RoutesWithContent = [{

  path: '',
  content: 'admin/fixer',
  component: ProfileFixerComponent

}];

@NgModule({
  declarations: [ ProfileFixerComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    IconModule,
    ButtonChangerModule,
    ActionbarModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class ProfileFixerModule { }
