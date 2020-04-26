import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatButtonModule } from '@angular/material/button';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { GtagModule } from '@wizdm/gtag';
import { AnimateModule } from '@wizdm/animate';
import { RedirectModule } from '@wizdm/redirect';
import { ReadmeModule } from '@wizdm/elements/readme';
import { IconModule } from '@wizdm/elements/icon';
//import { AuthGuard } from 'app/utils/auth-guard';
//import { PageGuard } from 'app/utils/page-guard';
import { FeaturesComponent } from './features.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'features',
    component: FeaturesComponent,
    //canActivate: [ AuthGuard ],
    //canDeactivate: [ PageGuard ]
  }
];

@NgModule({
  declarations: [ 
    FeaturesComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    GtagModule,
    AnimateModule,
    RedirectModule,
    ReadmeModule,
    IconModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class FeaturesModule { }
