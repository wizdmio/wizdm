import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyDialogDirective } from './lazy-dialog.directive';

@NgModule({
  
  imports: [ CommonModule ],
  declarations: [ LazyDialogDirective ],
  exports: [ LazyDialogDirective ],
  providers: [],
})
export class LazyDialogModule { }