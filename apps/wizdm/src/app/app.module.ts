import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations' 
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material';

import { 
  ConnectModule, 
  AuthModule, 
  DatabaseModule, 
  UploaderModule, 
  UserProfileModule 
} from '@wizdm/connect';

import { AppComponent } from './app.component';
import { NavigatorModule } from './navigator/navigator.module';
import { PagesModule } from './pages/pages.module';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // Initialize the database connection modules
    ConnectModule.forRoot(environment),
    AuthModule,
    DatabaseModule,
    UploaderModule,
    UserProfileModule,
    NavigatorModule,
    PagesModule,
    AppRoutingModule
  ],
  providers: [
    MatIconRegistry
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
