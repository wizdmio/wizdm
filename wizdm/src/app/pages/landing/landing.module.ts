import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GtagModule } from '@wizdm/gtag';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { ScrollingModule } from 'app/utils/scrolling';
import { BackgroundModule } from 'app/utils/background';
import { LandingComponent } from './landing.component';
import { LoadWidgetDirective, Widgets } from './widgets/load-widget.directive';
import { LandingResolver } from './landing.service';

const routes: RoutesWithContent = [
  {
    path: '',
    //content: 'landing',
    resolve: { landing: LandingResolver },
    component: LandingComponent
  }
];

/** List of widgets */
const widgets: Widgets = [

  // Banner Widget
  { type: 'banner', loadComponent: () => import('./widgets/banner/banner.component').then( ({ BannerComponent }) => BannerComponent ) },

  // Feature matrix widget
  { type: 'feature-matrix', loadComponent: () => import('./widgets/features/features.component').then( ({ FeaturesComponent }) => FeaturesComponent ) }

];

@NgModule({
  // Provides the widgets registry for the loader to load from
  providers: [ { provide: 'widgets', useValue: widgets }, LandingResolver ],
  declarations: [ LandingComponent, LoadWidgetDirective ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    GtagModule,
    ScrollingModule,
    BackgroundModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class LandingModule { }
