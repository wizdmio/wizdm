import { NgModule } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AnimateComponent } from './animate.component';
import { AnimateDirective } from './animate.directive';

@NgModule({
  imports: [ ScrollingModule ],
  declarations: [ AnimateComponent, AnimateDirective ],
  exports: [ AnimateComponent, AnimateDirective ]
})
export class AnimateModule { }
