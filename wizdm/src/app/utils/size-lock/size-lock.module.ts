import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SizeLockDirective } from './size-lock.directive';

@NgModule({
  imports: [ ScrollingModule ],
  declarations: [ SizeLockDirective ],
  exports: [ SizeLockDirective ]
})
export class SizeLockModule { }
