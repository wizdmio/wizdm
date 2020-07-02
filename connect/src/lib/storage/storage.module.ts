import { NgModule } from '@angular/core';
import { StorageService } from './storage.service';
import 'firebase/storage';

@NgModule({
  providers: [ StorageService ]
})
export class StorageModule { }