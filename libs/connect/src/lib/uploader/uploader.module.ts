import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { DatabaseModule } from '../database/database.module';
import { UploaderService } from './uploader.service';

@NgModule({
  imports: [
    CommonModule,
    DatabaseModule,
    AngularFireStorageModule
  ],
  providers: [ UploaderService ]
})
export class UploaderModule { }
