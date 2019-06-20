import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';        
import { AvatarModule } from '../../elements/avatar';
import { LikesModule } from '../../elements/likes';
import { ContentResolver } from '../../core';
import { UserInfoModule } from '../user-info/user-info.module';
import { ExploreComponent } from './explore.component';
import { ExploreItemComponent } from './item/item.component';

const routes: Routes = [
  {
    path: '',
    component: ExploreComponent,
    resolve: { content: ContentResolver }, 
    data: { modules: ['explore'] },
    //canActivate: [ ContentResolver ],
    canDeactivate: [ ContentResolver ]
  }
];

@NgModule({
  declarations: [ 
    ExploreComponent, 
    ExploreItemComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    AvatarModule, 
    LikesModule,
    UserInfoModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class ExploreModule { }
