import { NgModule } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollDirective } from './scroll.directive';
import { ScrollableDirective } from './scrollable.directive';

@NgModule({
  imports: [ ScrollingModule ],
  declarations: [ ScrollDirective, ScrollableDirective ],
  exports: [ ScrollDirective, ScrollableDirective ]
})
export class ScrollModule { }
