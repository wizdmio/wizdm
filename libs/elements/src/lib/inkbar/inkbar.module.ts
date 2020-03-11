import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InkbarComponent } from './inkbar.component';
import { InkbarDirective } from './inkbar.directive';

@NgModule({
  declarations: [ InkbarComponent, InkbarDirective ],
  imports: [ CommonModule ],
  exports: [ InkbarComponent, InkbarDirective ]
})
export class InkbarModule {}
