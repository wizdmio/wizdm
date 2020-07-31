import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TeleportModule } from '@wizdm/teleport';
import { FabPortalComponent } from './fab-portal.component';

@NgModule({
  
  imports: [
    //CommonModule,
    FlexLayoutModule,
    TeleportModule
  ],
  declarations: [ FabPortalComponent ],
  exports: [ FabPortalComponent ]
})
export class FabPortalModule { }
