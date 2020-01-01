import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
//import { RedirectModule } from '@wizdm/redirect';
import { ReadmeModule } from '@wizdm/elements/readme';
//import { AuthGuard } from 'app/utils/auth-guard';
//import { PageGuard } from 'app/utils/page-guard';
import { NotFoundComponent } from './not-found.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'not-found',
    component: NotFoundComponent
    //canActivate: [ AuthGuard ],
    //canDeactivate: [ PageGuard ]
  }
];

@NgModule({
  declarations: [ NotFoundComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReadmeModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class NotFoundModule { }
