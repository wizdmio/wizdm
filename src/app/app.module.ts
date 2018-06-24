import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations' 
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AppComponent } from 'app/app.component';
import { NavigatorModule } from 'app/navigator/navigator.module';
import { PagesModule } from 'app/pages/pages.module';
import { AppRoutingModule } from 'app/app-routing.module';

import { 
  ContentManager, 
  ContentResolver, 
  AuthService
} from 'app/core';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    AngularFireModule.initializeApp(environment.firebase, 'wizdm'),
    AngularFireAuthModule,
    AngularFirestoreModule,

    NavigatorModule,
    PagesModule,
    AppRoutingModule
  ],
  providers: [
    MatIconRegistry,
    ContentManager,
    ContentResolver,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
