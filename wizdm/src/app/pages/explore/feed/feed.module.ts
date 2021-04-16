import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatButtonModule } from '@angular/material/button';
import { IconModule } from '@wizdm/elements/icon';
import { ButtonChangerModule } from '@wizdm/elements/button';
import { GtagModule } from '@wizdm/gtag';
import { ActionbarModule } from 'app/navigator/actionbar';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { PostModule } from './post/post.module';
import { FeedComponent } from './feed.component';
import { DialogLoader } from 'app/dialogs';


const routes: RoutesWithContent = [{
  path: '',
  component: FeedComponent,
  content: 'explore-feed',
  children: [
    { path: 'edit', loadChildren: () => import('./edit/edit.module').then(m => m.EditModule), canActivate: [ DialogLoader ] }
  ]
}];

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
    PostModule,
    ContentRouterModule.forChild(routes)
  ],
  providers: [ DialogLoader ]
})
export class FeedModule { }
