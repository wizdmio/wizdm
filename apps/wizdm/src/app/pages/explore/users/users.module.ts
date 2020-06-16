import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { UsersComponent } from './users.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'users',
    component: UsersComponent
  }
];

@NgModule({
  declarations: [ UsersComponent ],
  imports: [
    CommonModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class UsersModule { }
