import { NgModule } from '@angular/core';
import { ToolbarDirective } from './toolbar.directive';

@NgModule({
  declarations: [ ToolbarDirective ],
  exports: [ ToolbarDirective ]
})
export class ToolbarModule { }
