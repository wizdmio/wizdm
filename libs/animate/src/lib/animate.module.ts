import { NgModule } from '@angular/core';
import { AnimateComponent } from './animate.component';
import { AnimateDirective } from './animate.directive';

@NgModule({
  declarations: [ AnimateComponent, AnimateDirective ],
  exports: [ AnimateComponent, AnimateDirective ]
  
})
export class AnimateModule { }
