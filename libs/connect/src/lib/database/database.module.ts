import { NgModule, ModuleWithProviders } from '@angular/core';
import { DatabaseService, PERSISTENCE_SETTINGS } from './database.service';
import { PersistenceSettings } from './database-application';
import 'firebase/firestore';


@NgModule({
  providers: [ DatabaseService ]
})
export class DatabaseModule {

  static enablePersistance(settings: PersistenceSettings): ModuleWithProviders<DatabaseModule> {
    return {
      ngModule: DatabaseModule,
      providers: [ { provide: PERSISTENCE_SETTINGS, useValue: settings } ]
    }
  }
}