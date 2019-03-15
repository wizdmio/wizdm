import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule, MatDividerModule } from '@angular/material';
import { AvatarModule } from '@wizdm/elements';
import { ContentResolver, 
         AuthGuardService, 
         PageGuardService } from '../../utils';import { UserInfoModule } from '../user-info/user-info.module';
import { MessagesComponent } from './messages.component';
import { MessageComponent } from './message/message.component';

const routes: Routes = [
  {
    path: '',
    component: MessagesComponent,
    resolve: { content: ContentResolver }, 
    data: { modules: ['messages', 'info'] },
    canActivate: [ AuthGuardService ]
  }
];

@NgModule({
  declarations: [ 
    MessagesComponent, 
    MessageComponent 
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatListModule, 
    MatDividerModule,
    AvatarModule,
    UserInfoModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class MessagesModule { }
