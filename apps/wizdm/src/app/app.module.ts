import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { FirebaseOptionsToken, FirebaseNameOrConfigToken } from '@angular/fire';
import { MatIconRegistry, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { ContentModule, ContentConfig } from '@wizdm/content';
import { ConnectModule, 
         AuthModule, 
         DatabaseModule, 
         UploaderModule, 
         UserProfileModule } from '@wizdm/connect';
import { DoorbellModule, DoorbellConfigToken } from '@wizdm/doorbell';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

// Define the singe lazy loading navigation routes
const routes: Routes = [ { path: '', loadChildren: () => import('./navigator/navigator.module').then(m => m.NavigatorModule) }];

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
    
    ContentModule.init({
      selector: 'lang', 
      contentRoot: 'assets/i18n',
      supportedValues: ['en', 'it', 'ru'],
      defaultValue: 'en'
    }),
    
    DoorbellModule.init({
      url: "https://doorbell.io/api/applications",
      id:  "10616",
      key: "dk6Bcyz265Qwwlt6e8rDxrrRZwkagGcemEQOukOhD81dBLQKWKCMle1Tdoxyr6oY"  
    }),

    AuthModule,
    DatabaseModule,
    UploaderModule,
    UserProfileModule,
    RouterModule.forRoot(routes, environment.router as ExtraOptions)
  ],
  providers: [
    MatIconRegistry,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [ MAT_DATE_LOCALE ]},
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    // Workaround to make sure initialization works while using --aot
    { provide: FirebaseOptionsToken, useValue: environment.firebase },
    { provide: FirebaseNameOrConfigToken, useValue: environment.appname || '' },
    //{ provide: DoorbellConfigToken, useValue: environment.doorbell }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
