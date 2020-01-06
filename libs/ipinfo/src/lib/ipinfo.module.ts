import { NgModule, ModuleWithProviders } from '@angular/core';
import { IpInfo, IpInfoConfig, IpInfoConfigToken } from './ipinfo.service';

@NgModule({
  providers: [IpInfo]
})
export class IpInfoModule { 

  static init(config: IpInfoConfig): ModuleWithProviders<IpInfoModule> {
    return {
      ngModule: IpInfoModule,
      providers: [ { provide: IpInfoConfigToken, useValue: config } ]
    }
  }
}
