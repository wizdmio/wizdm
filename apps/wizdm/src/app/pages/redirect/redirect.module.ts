import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { IconModule } from '../../elements/icon';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
//import { AuthGuard, PageGuard } from '../../utils';
import { RedirectComponent } from './redirect.component';

const routes: RoutesWithContent = [
  {
    path: '',
    component: RedirectComponent,
    content: 'redirect'
    //canActivate: [ AuthGuard ],
    //canDeactivate: [ PageGuard ]
  }
];

@NgModule({
  declarations: [ RedirectComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatProgressBarModule,
    IconModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class RedirectModule { }
