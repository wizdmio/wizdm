import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { GtagModule } from '@wizdm/gtag';
import { RedirectModule } from '@wizdm/redirect';
import { ReadmeModule } from '@wizdm/readme';
import { IconModule } from '@wizdm/elements/icon';
import { AvatarModule } from '@wizdm/elements/avatar';
import { MomentPipesModule } from '@wizdm/pipes/moment';
import { AuthGuardModule } from 'app/utils/auth-guard';
import { ValidProfile } from 'app/utils/user';
import { SidenavModule } from 'app/navigator/sidenav';
import { ExploreComponent } from './explore.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'explore',
    component: ExploreComponent,
    canActivate: [ ValidProfile ],
    children: [
      { path: '',       redirectTo: 'people', pathMatch: 'full' },
      { path: 'feed',   loadChildren: () => import('./feed/feed.module').then(m => m.FeedModule) },
      { path: 'people', loadChildren: () => import('./people/people.module').then(m => m.PeopleModule) },
      { path: 'groups', loadChildren: () => import('./groups/groups.module').then(m => m.GroupsModule) }
    ]
  }
];

@NgModule({
  declarations: [ ExploreComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatBadgeModule,
    MatListModule,
    GtagModule,
    RedirectModule,
    ReadmeModule,
    IconModule,
    AvatarModule,
    AuthGuardModule,
    SidenavModule, 
    MomentPipesModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class ExploreModule { }
