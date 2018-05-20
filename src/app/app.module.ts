import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations' 
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { FlexLayoutModule } from '@angular/flex-layout';

import {
  MatToolbarModule,
  MatMenuModule,
  MatButtonModule,
  MatIconModule, MatIconRegistry,
  MatCardModule
} from '@angular/material';

import { ContentManager, ContentResolver } from 'app/content';

import { AppComponent } from 'app/app.component';
import { NavigatorModule } from 'app/navigator/navigator.module';
import { HomeComponent } from 'app/pages/home/home.component';
import { JoinComponent } from 'app/pages/join/join.component';
import { NotFoundComponent } from 'app/pages/not-found/not-found.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    JoinComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    NavigatorModule,
    AppRoutingModule
  ],
  providers: [
    ContentManager,
    ContentResolver,
    MatIconRegistry
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
