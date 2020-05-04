import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { GtagModule } from '@wizdm/gtag';
import { RedirectModule } from '@wizdm/redirect';
import { AnimateModule } from '@wizdm/animate';
import { IconModule } from '@wizdm/elements/icon';
import { ReadmeModule } from '@wizdm/elements/readme';
import { IllustrationModule } from '@wizdm/elements/illustration';
import { BackgroundModule } from 'app/navigator/background';
import { HomeComponent } from './home.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'home',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [ HomeComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    GtagModule,
    RedirectModule,
    AnimateModule,
    IconModule, 
    ReadmeModule,
    IllustrationModule,
    BackgroundModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class HomeModule { }
