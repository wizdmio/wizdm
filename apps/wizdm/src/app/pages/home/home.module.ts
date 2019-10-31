import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { AnimateModule } from '../../elements/animate';
import { IconModule } from '../../elements/icon';
import { DisclaimerModule } from '../../elements/disclaimer';
import { IllustrationModule } from '../../elements/illustration';
import { AuthGuard, PageGuard } from '../../utils';
import { HomeComponent } from './home.component';

const routes: RoutesWithContent = [
  {
    path: '',
    component: HomeComponent,
    content: 'home',
    //canActivate: [ AuthGuard ],
    canDeactivate: [ PageGuard ]
  }
];

@NgModule({
  declarations: [ HomeComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    AnimateModule,
    IconModule, 
    DisclaimerModule,
    IllustrationModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class HomeModule { }
