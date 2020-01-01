import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatButtonModule } from '@angular/material/button';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { ReadmeModule } from '@wizdm/elements/readme';
import { ThumbnailModule } from '@wizdm/elements/thumbnail';
import { AvatarModule } from '@wizdm/elements/avatar';
import { IconModule } from '@wizdm/elements/icon';
//import { AuthGuard } from 'app/utils/auth-guard';
import { PageGuard } from 'app/utils/page-guard';
import { FolderModule } from 'app/dialogs/folder';
import { UserInfoModule } from 'app/dialogs/user-info';
//import { TopicComponent } from './topic-item/topic-item.component';
//import { TopicFormModule } from './topic-form/topic-form.module';
import { ExploreComponent } from './explore.component';
import { StoryCardComponent } from './story-card/story-card.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: ['explore', 'folder'],
    component: ExploreComponent,
    //canActivate: [ AuthGuard ],
    canDeactivate: [ PageGuard ]
  }
];

@NgModule({
  declarations: [ 
    ExploreComponent, 
    StoryCardComponent, 
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    ReadmeModule,
    ThumbnailModule,
    AvatarModule, 
    IconModule,
    FolderModule,
    UserInfoModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class ExploreModule { }
