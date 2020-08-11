import { NgModule } from '@angular/core';
import { DialogLoader } from './dialog-loader.service';
import { DialogOutletDirective } from './dialog-outlet.directive';

@NgModule({
  declarations: [ DialogOutletDirective ],
  exports: [ DialogOutletDirective ]
})
export class DialogsModule { }
