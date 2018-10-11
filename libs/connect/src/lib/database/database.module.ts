import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFirestoreModule  } from '@angular/fire/firestore';
import { DatabaseService } from './database.service';

@NgModule({
  imports: [
    CommonModule, 
    AngularFirestoreModule
  ],
  providers: [ DatabaseService ]
})
export class DatabaseModule {}
