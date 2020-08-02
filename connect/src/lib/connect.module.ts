import { NgModule, ModuleWithProviders, InjectionToken, Inject, Optional } from '@angular/core';
import { default as firebase, app } from 'firebase/app'; 

/** FirebaseApp type */
export type FirebaseApp = app.App;

/** Firebase APP token */
export const APP = new InjectionToken<FirebaseApp>('wizdm.connect.app');

/** Firebase Config */
export type ConnectConfig = { [key:string]: any };

/** Firebase Config token */
export const APP_OPTIONS = new InjectionToken<ConnectConfig>('wizdm.connect.app.options');

/** Firebase app name token */
export const APP_NAME = new InjectionToken<string>('wizdm.connect.app.name');

/** Firebase APP factory */
export function appFactory(options?: ConnectConfig, name?: string): FirebaseApp {

  // Seeks for the app if it were already initialized (happens when hot-reloading)
  const app = firebase.apps.find( app => app.name === name || '[DEFAULT]');
  // Return the app or initialize a new one
  return (app || firebase.initializeApp(options, name)) as FirebaseApp;
}

@NgModule({})
export class ConnectModule { 

  static init(options: ConnectConfig, name?: string): ModuleWithProviders<ConnectModule> {
    return {
      ngModule: ConnectModule,
      providers: [

        // Provides the Firebase Options
        { provide: APP_OPTIONS, useValue: options },

        // Provides the Firebase app name
        { provide: APP_NAME, useValue: name },
        
        // Provides Firebase app instance used by all the services
        { provide: APP, useFactory: appFactory, deps: [
          [ new Optional(), new Inject(APP_OPTIONS) ],
          [ new Optional(), new Inject(APP_NAME)    ]
        ]}
      ]
    }
  }
}