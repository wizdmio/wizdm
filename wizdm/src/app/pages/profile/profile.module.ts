import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AvatarModule } from '@wizdm/elements/avatar';
import { IconModule } from '@wizdm/elements/icon';
import { ButtonChangerModule } from '@wizdm/elements/button';
import { ActionbarModule } from 'app/navigator/actionbar';
import { ScrollingModule } from 'app/utils/scrolling';
import { ProfileService } from './profile.service';
import { ProfileComponent } from './profile.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'profile',
    component: ProfileComponent,
    canActivate: [ ProfileService ]
  }
];

@NgModule({
  declarations: [ ProfileComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    AvatarModule,
    IconModule,
    ButtonChangerModule,
    ScrollingModule,
    ActionbarModule,
    ContentRouterModule.forChild(routes)
  ],
  providers: [ ProfileService ]
})
export class ProfileModule { }
