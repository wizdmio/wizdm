import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { GtagModule } from '@wizdm/gtag';
import { RedirectModule } from '@wizdm/redirect';
import { AnimateModule } from '@wizdm/animate';
import { IconModule } from '@wizdm/elements/icon';
import { ReadmeModule } from '@wizdm/readme';
import { IllustrationModule } from '@wizdm/elements/illustration';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { BackgroundModule } from 'app/utils/background';
import { LandingComponent } from './landing.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'landing',
    component: LandingComponent
  }
];

@NgModule({
  declarations: [ LandingComponent ],
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
export class LandingModule { }
