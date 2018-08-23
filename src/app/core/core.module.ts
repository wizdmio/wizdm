import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
/*
import { AuthService } from './auth/auth.service';
import { DatabaseService } from './database/database.service';
import { StorageService } from './storage/storage.service';
import { UploaderService } from './uploader/uploader.service';
import { ContentService } from './content/content-manager.service'; 
import { ResolverService } from './resolver/resolver.service';
import { AuthGuardService } from './guards/auth-guard.service';
import { PageGuardService } from './guards/page-guard.service';
import { ProjectService } from './project/project.service';
import { ChatService } from './chat/chat.service';
*/
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
