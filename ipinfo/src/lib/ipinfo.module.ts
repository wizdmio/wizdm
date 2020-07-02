import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IpInfo, IpInfoConfig, IPINFO_CONFIG } from './ipinfo.service';

@NgModule({
  imports: [ HttpClientModule ],
  providers: [ IpInfo ]
})
export class IpInfoModule { 

  static init(config: IpInfoConfig): ModuleWithProviders<IpInfoModule> {
    return {
      ngModule: IpInfoModule,
      providers: [ { provide: IPINFO_CONFIG, useValue: config } ]
    }
  }
}
