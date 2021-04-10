import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { PipesModule } from '@wizdm/connect/database/pipes';
import { MomentPipesModule } from '@wizdm/pipes/moment';
import { ContentModule } from '@wizdm/content';
import { AvatarModule } from '@wizdm/elements/avatar';
import { PostComponent } from './post.component';

@NgModule({
  imports: [ 
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MatButtonModule,
    MatMenuModule,
    MomentPipesModule,
    PipesModule,
    ContentModule,
    AvatarModule
  ],
  declarations: [ PostComponent ],
  exports: [ PostComponent ]
})
export class PostModule { }
