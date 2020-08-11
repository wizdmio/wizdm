import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatButtonModule } from '@angular/material/button';
import { IconModule } from '@wizdm/elements/icon';
import { ButtonChangerModule } from '@wizdm/elements/button';
import { GtagModule } from '@wizdm/gtag';
import { ActionbarModule } from 'app/navigator/actionbar';
import { RedirectModule } from '@wizdm/redirect';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { PostModule } from './post/post.module';
import { FeedComponent } from './feed.component';
import { AddPostModule } from './add-post/add-post.module'

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'explore-feed',
    component: FeedComponent
  }
];

@NgModule({
  declarations: [ FeedComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    IconModule,
    ButtonChangerModule,
    GtagModule,
    ActionbarModule,
    AddPostModule,
    PostModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class FeedModule { }
