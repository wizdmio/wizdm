import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalDirective } from './portal.directive';
import { TeleportDirective } from './teleport.directive';
import { TeleportService, TeleportConfigToken, TeleportConfig } from './teleport.service';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ PortalDirective, TeleportDirective ],
  exports: [ PortalDirective, TeleportDirective ],
  
})
export class TeleportModule { 

  static init(config: TeleportConfig): ModuleWithProviders<TeleportModule> {

    return {
      ngModule: TeleportModule,
      providers: [
        TeleportService,
        { provide: TeleportConfigToken, useValue: config }
      ]
    };
  }
}
