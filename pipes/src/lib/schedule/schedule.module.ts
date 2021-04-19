import { NgModule } from '@angular/core';
import { SchedulePipe } from './schedule.pipe';

const PIPES = [ SchedulePipe ];

@NgModule({
  imports: [],
  declarations: PIPES,
  exports: PIPES
})
export class SchedulePipesModule { }
