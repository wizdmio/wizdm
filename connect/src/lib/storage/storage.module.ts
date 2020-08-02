import { NgModule, Optional, Inject } from '@angular/core';
import { StorageService } from './storage.service';
import { APP, FirebaseApp } from '@wizdm/connect';
import 'firebase/storage';

@NgModule({
  providers: [ StorageService ]
})
export class StorageModule { 

  constructor(@Optional() @Inject(APP) app: FirebaseApp) {

    if(!app) { throw new Error('ConnectModule initialization failed. Make sure to call ConnectModule.init() prior to use any of the feature packages.'); }
  }
}