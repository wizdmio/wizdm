import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { RedirectModule } from '@wizdm/redirect';
import { AnimateModule } from '@wizdm/animate';
import { IconModule } from '@wizdm/elements/icon';
import { ReadmeModule } from '@wizdm/elements/readme';
import { IllustrationModule } from '@wizdm/elements/illustration';
//import { AuthGuard } from 'app/utils/auth-guard';
//import { PageGuard } from 'app/utils/page-guard';
import { HomeComponent } from './home.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'home',
    component: HomeComponent,
    //canActivate: [ AuthGuard ],
    //canDeactivate: [ PageGuard ]
  }
];

@NgModule({
  declarations: [ HomeComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    RedirectModule,
    AnimateModule,
    IconModule, 
    ReadmeModule,
    IllustrationModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class HomeModule { }
