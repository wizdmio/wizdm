import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule, 
         MatButtonModule, 
         MatMenuModule, 
         MatDialogModule } from '@angular/material';
import { ColorsModule, 
         ColorPickerModule,
        AvatarModule } from '@wizdm/elements';
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
    ColorsModule,
    ColorPickerModule,
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
