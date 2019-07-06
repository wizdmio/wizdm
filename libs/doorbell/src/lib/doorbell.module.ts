import { NgModule, ModuleWithProviders } from '@angular/core';
import { DoorbellConfig } from './doorbell.definitions';
import { DoorbellService, DoorbellConfigToken } from './doorbell.service';

@NgModule({
  providers: [DoorbellService]
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
