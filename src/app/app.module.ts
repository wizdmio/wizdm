import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations' 
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import {
  MatToolbarModule,
  MatMenuModule,
  MatButtonModule,
  MatIconModule, MatIconRegistry,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatStepperModule
} from '@angular/material';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AppComponent } from 'app/app.component';
import { NavigatorModule } from 'app/navigator/navigator.module';
import { HomeComponent } from 'app/pages/home/home.component';
import { LoginComponent } from 'app/pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ApplyComponent } from './pages/apply/apply.component';
import { BrowserComponent } from './pages/browser/browser.component';
import { ProjectComponent } from './pages/project/project.component';
import { NotFoundComponent } from 'app/pages/not-found/not-found.component';
import { AppRoutingModule } from './app-routing.module';

import { 
  ContentManager, 
  ContentResolver, 
  AuthService
} from 'app/core';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    ApplyComponent,
    BrowserComponent,
    ProjectComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    
    FlexLayoutModule,
    
    MatToolbarModule,
    //MatMenuModule,
    MatButtonModule,
    MatIconModule,
    //MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,

    AngularFireModule.initializeApp(environment.firebase, 'wizdm'),
    AngularFireAuthModule,
    AngularFirestoreModule,

    NavigatorModule,
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
