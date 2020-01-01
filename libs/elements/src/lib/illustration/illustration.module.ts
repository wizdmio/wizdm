import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IllustrationComponent } from './illustration.component';

@NgModule({
  declarations: [ IllustrationComponent ],
  imports: [ CommonModule, HttpClientModule ],
  exports: [ IllustrationComponent ]
})
export class IllustrationModule { }
