import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';
import { NgModule } from '@angular/core';
import 'firebase/auth';

@NgModule({
  providers: [ AuthService, AuthGuard ]
})
export class AuthModule {}