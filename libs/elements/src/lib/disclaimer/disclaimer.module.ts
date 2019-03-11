import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DisclaimerComponent } from './disclaimer.component';

@NgModule({
  declarations: [DisclaimerComponent],
  imports: [CommonModule,RouterModule],
  exports: [DisclaimerComponent]
})
export class DisclaimerModule {}
