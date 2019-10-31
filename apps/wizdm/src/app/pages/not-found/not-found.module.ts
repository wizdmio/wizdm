import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
//import { AuthGuard, PageGuard } from '../../utils';
import { NotFoundComponent } from './not-found.component';

const routes: RoutesWithContent = [
  {
    path: '',
    component: NotFoundComponent,
    content: 'notFound'
    //canActivate: [ AuthGuard ],
    //canDeactivate: [ PageGuard ]
  }
];

@NgModule({
  declarations: [ NotFoundComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class NotFoundModule { }
