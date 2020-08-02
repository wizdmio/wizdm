import { NgModule, Optional, Inject } from '@angular/core';
import { APP, FirebaseApp } from '@wizdm/connect';
import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';
import 'firebase/auth';

@NgModule({
  providers: [ AuthService, AuthGuard ]
})
export class AuthModule {

  constructor(@Optional() @Inject(APP) app: FirebaseApp) {

    if(!app) { throw new Error('ConnectModule initialization failed. Make sure to call ConnectModule.init() prior to use any of the feature packages.'); }
  }
}