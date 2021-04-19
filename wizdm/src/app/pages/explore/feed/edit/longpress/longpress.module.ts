import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LongPressComponent } from './longpress.component';

@NgModule({
  
  imports: [ CommonModule ],
  declarations: [ LongPressComponent ],
  exports: [ LongPressComponent ]
})
export class LongPressModule { }
