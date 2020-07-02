import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { default as firebase, app } from 'firebase/app'; 

export type ConnectConfig = { [key:string]: any };
export type FirebaseApp = app.App;

export const APP = new InjectionToken<FirebaseApp>('wizdm.connect.app');

export function appFactory(options?: ConnectConfig, name?: string): FirebaseApp {

  // Seeks for the app if it were already initialized (happens when hot-reloading)
  const app = firebase.apps.find( app => app.name === name || '[DEFAULT]');
  // Return the app or initializa a new one
  return (app || firebase.initializeApp(options, name)) as FirebaseApp;
}

@NgModule({})
export class ConnectModule { 

  static init(options: ConnectConfig, name?: string): ModuleWithProviders<ConnectModule> {
    return {
      ngModule: ConnectModule,
      providers: [{ 
        provide: APP, 
        useFactory: () => appFactory(options, name) 
      }]
    }
  }
}