import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations' 
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AppComponent } from './app.component';
import { NavigatorModule } from './navigator/navigator.module';
import { PagesModule } from './pages/pages.module';
import { AppRoutingModule } from './app-routing.module';

import { 
  AuthService,
  ContentService, 
  ResolverService,
  PageGuardService
} from './core';

import { environment } from 'environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    AngularFireModule.initializeApp(environment.firebase, 'wizdm'),
    //AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFirestoreModule,

    NavigatorModule,
    PagesModule,
    AppRoutingModule
  ],
  providers: [
    MatIconRegistry,
    //---
    AuthService,
    ContentService,
    ResolverService,
    PageGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
