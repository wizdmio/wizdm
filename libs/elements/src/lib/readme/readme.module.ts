import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadmeComponent } from './readme.component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ ReadmeComponent ],
  exports: [ ReadmeComponent ]
})
export class ReadmeModule { }