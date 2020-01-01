import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { AvatarModule } from '@wizdm/elements/avatar';
import { UserInfoComponent } from './user-info.component';
import { UserInfoDirective } from './user-info.directive';

@NgModule({
  imports: [ 
    CommonModule,
    FlexLayoutModule,
    MatIconModule, 
    MatButtonModule, 
    MatMenuModule, 
    MatDialogModule,
    AvatarModule
  ],
  declarations: [
    UserInfoComponent,
    UserInfoDirective
  ],
  exports: [
    UserInfoComponent,
    UserInfoDirective
  ]
})
export class UserInfoModule { }
