import { NgModule, ModuleWithProviders } from '@angular/core';
import { AngularFireModule, FirebaseOptions, FirebaseOptionsToken, FirebaseNameOrConfigToken } from '@angular/fire';

export type ConnectConfig = FirebaseOptions;

@NgModule({
  imports: [ AngularFireModule ],
  declarations: []
})
export class ConnectModule { 

  static init(config: ConnectConfig, appname?: string): ModuleWithProviders<ConnectModule> {
    return {
      ngModule: ConnectModule,
      providers: [
        { provide: FirebaseOptionsToken, useValue: config },
        { provide: FirebaseNameOrConfigToken, useValue: appname || '' }
      ]
    }
  }
}