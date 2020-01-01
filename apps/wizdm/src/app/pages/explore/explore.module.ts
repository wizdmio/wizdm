import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatButtonModule } from '@angular/material/button';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { AnimateModule } from '@wizdm/animate';
import { RedirectModule } from '@wizdm/redirect';
import { ReadmeModule } from '@wizdm/elements/readme';
import { IconModule } from '@wizdm/elements/icon';
//import { AuthGuard } from 'app/utils/auth-guard';
//import { PageGuard } from 'app/utils/page-guard';
import { ExploreComponent } from './explore.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'explore',
    component: ExploreComponent,
    //canActivate: [ AuthGuard ],
    //canDeactivate: [ PageGuard ]
  }
];

@NgModule({
  declarations: [ 
    ExploreComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    AnimateModule,
    RedirectModule,
    ReadmeModule,
    IconModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class ExploreModule { }
