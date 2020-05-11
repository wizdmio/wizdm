import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
//import { RedirectModule } from '@wizdm/redirect';
import { ReadmeModule } from '@wizdm/readme';
import { NotFoundComponent } from './not-found.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'not-found',
    component: NotFoundComponent
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
