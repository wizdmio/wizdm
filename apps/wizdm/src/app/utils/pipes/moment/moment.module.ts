import { NgModule } from '@angular/core';
import { MomentPipe } from './moment.pipe';
import { FromNowPipe } from './from-now.pipe';
import { ToNowPipe } from './to-now.pipe';
import { CalendarPipe } from './calendar.pipe';
import { OlderThanPipe } from './older-than.pipe';

@NgModule({
  imports: [],
  declarations: [ MomentPipe, FromNowPipe, ToNowPipe, CalendarPipe, OlderThanPipe ],
  exports: [ MomentPipe, FromNowPipe, ToNowPipe, CalendarPipe, OlderThanPipe ] 
})
export class MomentPipeModule { }
