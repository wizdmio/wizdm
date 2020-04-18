import { NgModule } from '@angular/core';
import { ScrollingModule, CdkScrollable } from '@angular/cdk/scrolling';
import { ScrollDirective } from './scroll.directive';

@NgModule({
  imports: [ ScrollingModule ],
  declarations: [ ScrollDirective ],
exports: [ ScrollDirective, CdkScrollable ]
})
export class ScrollModule { }
