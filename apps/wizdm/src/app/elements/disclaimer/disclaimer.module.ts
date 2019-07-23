import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkModule } from '../link/link.module';
import { DisclaimerComponent } from './disclaimer.component';

@NgModule({
  declarations: [DisclaimerComponent],
  imports: [CommonModule, LinkModule],
  exports: [DisclaimerComponent]
})
export class DisclaimerModule {}
