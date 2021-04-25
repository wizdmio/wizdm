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
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { LazyDialogLoader, LazyDialogModule } from '@wizdm/lazy-dialog';
import { PostModule } from './post/post.module';
import { FeedComponent } from './feed.component';


const routes: RoutesWithContent = [{
  path: '',
  component: FeedComponent,
  content: 'explore-feed',
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
    ContentRouterModule.forChild(routes)
  ],
  providers: [ LazyDialogLoader ]
})
export class FeedModule { }
