import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations' 
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatIconRegistry, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { ConnectModule, 
         AuthModule, 
         DatabaseModule, 
         UploaderModule, 
         UserProfileModule } from '@wizdm/connect';
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
    ConnectModule.init(environment),
    AuthModule,
    DatabaseModule,
    UploaderModule,
    UserProfileModule,
    NavigatorModule,
    AppRoutingModule
  ],
  providers: [
    MatIconRegistry,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [ MAT_DATE_LOCALE ]},
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
