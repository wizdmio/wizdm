import { NgModule } from '@angular/core';
import { MomentPipe,
         FromNowPipe,
         ToNowPipe,
         CalendarPipe,
         OlderThanPipe } from './moment.pipe';

const PIPES = [ MomentPipe, FromNowPipe, ToNowPipe, CalendarPipe, OlderThanPipe ];

@NgModule({
  imports: [],
  declarations: PIPES,
  exports: PIPES
})
export class MomentPipesModule { }
