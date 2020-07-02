import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TocComponent } from './toc.component';


@NgModule({
  imports: [ 
    CommonModule, 
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule 
  ],
  declarations: [ TocComponent ],
  exports: [ TocComponent ]
})
export class TocModule { }
