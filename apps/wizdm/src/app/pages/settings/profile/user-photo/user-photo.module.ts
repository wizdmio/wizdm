import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ContentModule } from '@wizdm/content';
import { ReadmeModule } from '@wizdm/readme';
import { AvatarModule } from '@wizdm/elements/avatar';
import { IconModule } from '@wizdm/elements/icon';
import { UserPhotoComponent } from './user-photo.component';


@NgModule({
  
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatProgressBarModule,
    ContentModule,
    ReadmeModule,
    AvatarModule,
    IconModule
  ],
  declarations: [ UserPhotoComponent ],
  exports: [ UserPhotoComponent ]
})
export class UserPhotoModule { }
