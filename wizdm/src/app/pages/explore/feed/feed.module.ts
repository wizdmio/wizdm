import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
//import { MatProgressBarModule } from '@angular/material/progress-bar';
import { IconModule } from '@wizdm/elements/icon';
import { ButtonChangerModule } from '@wizdm/elements/button';
import { GtagModule } from '@wizdm/gtag';
import { ActionbarModule } from 'app/navigator/actionbar';
import { LazyDialogLoader, LazyDialogModule } from '@wizdm/lazy-dialog';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { AuthGuard, loggedIn } from 'app/utils/auth-guard';
import { PostModule } from './post/post.module';
import { CardModule } from './card/card.module';
import { FeedComponent } from './feed.component';


const routes: RoutesWithContent = [{
  path: '',
  content: 'explore-feed',
  component: FeedComponent,
  canActivate: [ AuthGuard ], data: { authGuardPipe: loggedIn },  
  children: [
    { path: 'edit', loadChildren: () => import('./edit/edit.module').then(m => m.EditModule), canActivate: [ LazyDialogLoader ] }
  ]
}];

@NgModule({
  declarations: [ FeedComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatBadgeModule,
    IconModule,
    ButtonChangerModule,
    GtagModule,
    ActionbarModule,
    LazyDialogModule,
    PostModule,
    CardModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class FeedModule { }
