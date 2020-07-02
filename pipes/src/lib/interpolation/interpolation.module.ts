import { NgModule } from '@angular/core';
import { PluckPipe, 
         InterpolatePipe,
         HyphenizePipe,
         CamelizePipe,
         PrintfPipe } from './interpolations.pipe';

const PIPES = [ PluckPipe, InterpolatePipe, HyphenizePipe, CamelizePipe, PrintfPipe ];

@NgModule({
  declarations: PIPES,
  exports: PIPES
})
export class InterpolationPipesModule { }
