import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { StorageService } from './storage.service';

@NgModule({
  imports: [
    CommonModule,
    AngularFireStorageModule
  ],
  providers: [ StorageService ]
})
export class StorageModule { }