import { NgModule } from '@angular/core';
import { BackgroundDirective } from './background.directive';

@NgModule({
  declarations: [ BackgroundDirective ],
  exports: [ BackgroundDirective ]
})
export class BackgroundModule { }
