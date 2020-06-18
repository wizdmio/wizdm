import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { PeopleComponent } from './people.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'explore/people',
    component: PeopleComponent
  }
];

@NgModule({
  declarations: [ PeopleComponent ],
  imports: [
    CommonModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class PeopleModule { }
