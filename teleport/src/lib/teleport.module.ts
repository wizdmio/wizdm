import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalDirective } from './portal.directive';
import { TeleportDirective } from './teleport.directive';
import { TeleportConfigToken, TeleportConfig } from './teleport.service';
import { OnNextAnimationFramePipe } from './pipes';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ PortalDirective, TeleportDirective, OnNextAnimationFramePipe ],
  exports: [ PortalDirective, TeleportDirective, OnNextAnimationFramePipe ]
  
})
export class TeleportModule { 

  static init(config: TeleportConfig): ModuleWithProviders<TeleportModule> {

    return {
      ngModule: TeleportModule,
      providers: [
        { provide: TeleportConfigToken, useValue: config }
      ]
    };
  }
}
