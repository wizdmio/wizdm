import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { DatabaseService } from './database.service';

@NgModule({
  imports: [
    CommonModule, 
    AngularFirestoreModule
  ],
  providers: [
    DatabaseService/*,
    // Overrides the default firestore setting to remove timestampsInSnapshots: true now deprecated
    // {@see https://github.com/angular/angularfire2/issues/1993}
    { provide: FirestoreSettingsToken, useValue: {} }*/
  ]

})
export class DatabaseModule {}
