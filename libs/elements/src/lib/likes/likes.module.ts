import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';
import { IconModule } from '../icon/icon.module';
import { LikesComponent } from './likes.component';

@NgModule({
  declarations: [LikesComponent],
  imports: [CommonModule, MatButtonModule, IconModule],
  exports: [LikesComponent]
})
export class LikesModule {}
