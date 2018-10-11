import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule, FirebaseOptions } from '@angular/fire';

export interface ConnectConfig {
  appname?: string,
  firebase: FirebaseOptions
}

@NgModule({
  imports: [
    CommonModule, 
    AngularFireModule
  ],
  declarations: []
})
export class ConnectModule { 

  static forRoot(config: ConnectConfig): ModuleWithProviders<ConnectModule> {
    // Initialize the ANngularFire2 app to extract the relevant configuration providers 
    const fire = AngularFireModule.initializeApp(config.firebase, config.appname);
    return {
      ngModule: ConnectModule,
      providers: [ ...fire.providers ]
    }
  }
}
