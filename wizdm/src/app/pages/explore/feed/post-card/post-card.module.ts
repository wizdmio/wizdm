import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { ReadmeModule } from '@wizdm/readme';
import { IconModule } from '@wizdm/elements/icon';
import { AvatarModule } from '@wizdm/elements/avatar';
import { ButtonChangerModule } from '@wizdm/elements/button';
import { MomentPipesModule } from '@wizdm/pipes/moment';
import { AuthGuardModule } from 'app/utils/auth-guard';
import { PostCardComponent } from './post-card.component';

@NgModule({
  declarations: [PostCardComponent],
  imports: [CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
    ReadmeModule,
    IconModule,
    AvatarModule,
    ButtonChangerModule,
    MomentPipesModule,
    AuthGuardModule
  ],
  exports: [PostCardComponent],
  providers: [],
})
export class PostCardModule { }