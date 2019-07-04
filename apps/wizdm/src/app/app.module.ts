import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations' 
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FirebaseOptionsToken, FirebaseNameOrConfigToken } from '@angular/fire';
import { MatIconRegistry, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { ConnectModule, 
         AuthModule, 
         DatabaseModule, 
         UploaderModule, 
         UserProfileModule } from '@wizdm/connect';
import { DoorbellModule } from '@wizdm/doorbell';
import { AppComponent } from './app.component';
import { NavigatorModule } from './navigator';
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
    ConnectModule,//.init(environment),
    AuthModule,
    DatabaseModule,
    UploaderModule,
    UserProfileModule,
    DoorbellModule.init(environment.doorbell),
    NavigatorModule,
    AppRoutingModule
  ],
  providers: [
    MatIconRegistry,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [ MAT_DATE_LOCALE ]},
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    // Workaround to make sure initialization works while using --aot
    { provide: FirebaseOptionsToken, useValue: environment.firebase },
    { provide: FirebaseNameOrConfigToken, useValue: environment.appname || '' }
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
