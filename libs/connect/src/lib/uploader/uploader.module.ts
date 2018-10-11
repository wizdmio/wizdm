import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFirestoreModule  } from '@angular/fire/firestore';
import { AngularFireStorageModule  } from '@angular/fire/storage';
import { UploaderService } from './uploader.service';

@NgModule({
  imports: [
    CommonModule,
    AngularFirestoreModule,
    AngularFireStorageModule
  ],
  providers: [ UploaderService ]
})
export class UploaderModule { }
