import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';

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
