import { NgModule } from '@angular/core';
import { TeleportModule } from '@wizdm/teleport';
import { SidenavDirective } from './sidenav.directive';


@NgModule({
  
  imports: [
    //TeleportModule
  ],
  declarations: [ SidenavDirective ],
  exports: [ SidenavDirective ]
})
export class SidenavModule { }
