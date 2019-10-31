import { NgModule, ModuleWithProviders } from '@angular/core';
import { DoorbellConfig, DoorbellConfigToken } from './doorbell.definitions';
import { DoorbellService } from './doorbell.service';

@NgModule({
  providers: [ DoorbellService ]
})
export class DoorbellModule {

  static init(config: DoorbellConfig): ModuleWithProviders<DoorbellModule> {
    return {
      ngModule: DoorbellModule,
      providers: [
        { provide: DoorbellConfigToken, useValue: config }
      ]
    }
  }
}
