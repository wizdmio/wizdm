import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { MatIconRegistry } from '@angular/material/icon';
import { DatabaseModule } from '@wizdm/connect/database';
import { StorageModule } from '@wizdm/connect/storage';
import { FunctionsModule } from '@wizdm/connect/functions';
import { AuthModule } from '@wizdm/connect/auth';
import { ConnectModule } from '@wizdm/connect';
import { ContentModule } from '@wizdm/content';
import { ReadmeNavigator } from '@wizdm/readme';
import { RedirectService } from '@wizdm/redirect';
import { EmojiSupportModule } from '@wizdm/emoji';
import { IpInfoModule } from '@wizdm/ipinfo';
import { GtagModule } from '@wizdm/gtag';
import { StripeModule } from '@wizdm/stripe';
import { ScrollingModule } from 'app/utils/scrolling';
import { AppComponent } from './app.component';  

// Environment
import { environment } from '../environments/environment';
const  { appname, content, emoji, scroll, ipinfo, tooltips, firebase, stripeTestKey, stripeLiveKey, gtag } = environment;

// Define the singe lazy loading navigation routes
const routes: Routes = [ 
  { path: '', loadChildren: () => import('./navigator/navigator.module').then(m => m.NavigatorModule) }
];

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    // Basics
    BrowserModule,
    BrowserAnimationsModule,
    // Firebase integration
    ConnectModule.init(firebase, appname),
    AuthModule, DatabaseModule, StorageModule, FunctionsModule,
    // IP location info
    IpInfoModule.init(ipinfo),   
    // Dynamic content (i18n)
    ContentModule.init(content),
    // Google Analytics
    GtagModule.init(gtag),
    // Universal Emoji support
    EmojiSupportModule.init(emoji),
    // Stripe payments w/ elements
    StripeModule.init(environment.production ? stripeLiveKey : stripeTestKey),
    // Angular's Router
    RouterModule.forRoot(routes),
    // Enables 'per page' scrolling behaviors overriding the router's configuration
    ScrollingModule.init(scroll)
  ],
  providers: [

    // Provides the redirection service globally
    RedirectService,

    // Applies the  redirection service to ReadmeComponent from @wizdm/elements
    { provide: ReadmeNavigator, useExisting: RedirectService },

    // Provides the MatIconRegistry globally
    MatIconRegistry,

    // Provides the MomentDateAdaper globally for @angular/material DatePicker
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [ MAT_DATE_LOCALE ]},

    // Configures Material Date Format accordingly
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },

    // Configures tooltips behavior globally
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: tooltips }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
