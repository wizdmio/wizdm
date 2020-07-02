import { NgModule } from '@angular/core';
import { TitleDirective } from './title.directive';

@NgModule({
  declarations: [ TitleDirective ],
  exports: [ TitleDirective ]
})
export class TitleModule { }
