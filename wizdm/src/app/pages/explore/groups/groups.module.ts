import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { GroupsComponent } from './groups.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'explore-groups',
    component: GroupsComponent
  }
];

@NgModule({
  declarations: [ GroupsComponent ],
  imports: [
    CommonModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class GroupsModule { }
