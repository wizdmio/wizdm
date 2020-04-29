import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import 'firebase/auth';

@NgModule({
  providers: [ AuthService ]
})
export class AuthModule {}