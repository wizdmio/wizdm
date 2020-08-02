import { NgModule, Optional, Inject } from '@angular/core';
import { FunctionsService } from './functions.service';
import { APP, FirebaseApp } from '@wizdm/connect';
import 'firebase/functions';

@NgModule({
  providers: [ FunctionsService ]
})
export class FunctionsModule {

  constructor(@Optional() @Inject(APP) app: FirebaseApp) {

    if(!app) { throw new Error('ConnectModule initialization failed. Make sure to call ConnectModule.init() prior to use any of the feature packages.'); }
  }
}