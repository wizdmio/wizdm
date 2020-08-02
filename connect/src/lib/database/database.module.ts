import { NgModule, ModuleWithProviders, Optional, Inject } from '@angular/core';
import { DatabaseService, PERSISTENCE_SETTINGS } from './database.service';
import { PersistenceSettings } from './database-application';
import { APP, FirebaseApp } from '@wizdm/connect';
import 'firebase/firestore';

@NgModule({
  providers: [ DatabaseService ]
})
export class DatabaseModule {

  constructor(@Optional() @Inject(APP) app: FirebaseApp) {

    if(!app) { throw new Error('ConnectModule initialization failed. Make sure to call ConnectModule.init() prior to use any of the feature packages.'); }
  }

  static enablePersistance(settings: PersistenceSettings): ModuleWithProviders<DatabaseModule> {
    return {
      ngModule: DatabaseModule,
      providers: [ { provide: PERSISTENCE_SETTINGS, useValue: settings } ]
    }
  }
}