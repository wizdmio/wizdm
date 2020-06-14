import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { GtagModule } from '@wizdm/gtag';
import { RedirectModule } from '@wizdm/redirect';
import { ReadmeModule } from '@wizdm/readme';
import { IconModule } from '@wizdm/elements/icon';
import { AvatarModule } from '@wizdm/elements/avatar';
import { ButtonChangerModule } from '@wizdm/elements/button';
import { MomentPipesModule } from '@wizdm/pipes/moment';
import { AuthGuardModule } from 'app/navigator/guards/auth-guard';
import { SidenavModule } from 'app/navigator/sidenav';
import { ExploreComponent } from './explore.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'explore',
    component: ExploreComponent,
    children: [

      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      { path: 'feed', loadChildren: () => import('./feed/feed.module').then(m => m.FeedModule) },
      { path: 'people', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
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
    ButtonChangerModule,
    AuthGuardModule,
    SidenavModule, 
    MomentPipesModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class ExploreModule { }
