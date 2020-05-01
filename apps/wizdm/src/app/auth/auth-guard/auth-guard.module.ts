import { NgModule } from '@angular/core';
import { AuthGuardDirective } from './auth-guard.directive';

@NgModule({
  declarations: [ AuthGuardDirective ],
  exports: [ AuthGuardDirective ]
})
export class AuthGuardModule { }
