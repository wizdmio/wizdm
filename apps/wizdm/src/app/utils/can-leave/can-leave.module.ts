import { NgModule } from '@angular/core';
import { CanLeaveGuard } from './can-leave.service';
import { CanLeaveDirective } from './can-leave.directive';

@NgModule({
  declarations: [ CanLeaveDirective ],
  providers: [ CanLeaveGuard ],
  exports: [ CanLeaveDirective ]
})
export class CanLeaveModule { }