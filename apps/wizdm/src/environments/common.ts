import { ExtraOptions } from '@angular/router';
import { ContentConfig } from '@wizdm/content';
import { firebase, doorbell } from "./secrets";

export const appname: string = 'wizdm';

export const content: ContentConfig = {
  selector: 'lang', 
  contentRoot: 'assets/i18n',
  supportedValues: ['en', 'it', 'ru'],
  defaultValue: 'en'
};

export const router: ExtraOptions = { 
  anchorScrolling: "enabled"
};

// Environment object common to all build configurations
export const common = {
  
  appname,
  content,
  router,
  firebase/*: { 
    apiKey: "Your api key",
    authDomain: "domain.firebaseapp.com",
    databaseURL: "https://yourapp.firebaseio.com",
    projectId: "Your project id",
    storageBucket: "yourapp.appspot.com",
    messagingSenderId: "Your sender id"
  }// to get the actual values go: https://console.firebase.google.com */,

  doorbell/*: {
    id: "Your app id",
    key: "Your app secret key"
  }// to get the actual values go: https://doorbell.io */
};