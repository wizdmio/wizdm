import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { IconModule } from '../../elements/icon';
import { NotifyComponent } from './notify.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    IconModule,
  ],
  declarations: [
    NotifyComponent
  ],
  exports: [
    NotifyComponent
  ]
})
export class NotifyModule { }
