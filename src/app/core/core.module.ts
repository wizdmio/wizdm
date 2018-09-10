import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { environment } from 'environments/environment';

@NgModule({
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(environment.firebase, environment.appname),
    //AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule
  ],

  declarations: [
  ],

  exports: [
  ],

  providers: [/* Using tree-shakable providers
    AuthService,
    DatabaseService,
    StorageService,
    UploaderService,
    ContentService,
    ResolverService,
    AuthGuardService,
    PageGuardService,
    ProjectService,
    ChatService*/
  ]
})
export class CoreModule { }
