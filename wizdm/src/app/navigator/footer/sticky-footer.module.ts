import { NgModule } from '@angular/core';
import { TeleportModule } from '@wizdm/teleport';
import { StickyFooterDirective } from './sticky-footer.directive';

@NgModule({
  
  imports: [ 
    //TeleportModule
  ],
  declarations: [
    StickyFooterDirective
  ],
  exports: [
    StickyFooterDirective
  ]
})
export class StickyFooterModule { }
