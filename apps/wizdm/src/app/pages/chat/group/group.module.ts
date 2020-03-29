import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatBadgeModule } from '@angular/material/badge';
import { AvatarModule } from '@wizdm/elements/avatar';
import { ChatGroup } from './group.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatBadgeModule,
    AvatarModule
  ],
  declarations: [ ChatGroup ],
  exports: [ ChatGroup ],
})
export class ChatGroupModule { }
