import { NgModule, ModuleWithProviders, Optional, Inject } from '@angular/core';
import { GtagConfig, GtagConfigToken, gtagFactory } from './gtag-factory';
import { GtagService, GTAG } from './gtag.service';
import { GtagDirective } from './gtag.directive';

@NgModule({
  providers: [ GtagService ],
  declarations: [ GtagDirective ],
  exports: [ GtagDirective ]
})
export class GtagModule {

  static init(config: GtagConfig): ModuleWithProviders<GtagModule> {
    return {
      ngModule: GtagModule,
      providers: [
        { provide: GtagConfigToken, useValue: config },
        { provide: GTAG,
          useFactory: gtagFactory, 
          deps: [ [ new Optional(), new Inject(GtagConfigToken) ] ] }
      ]
    };
  } 
}