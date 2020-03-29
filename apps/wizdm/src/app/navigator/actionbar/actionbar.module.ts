import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ActionComponent } from './action.component';
import { IconModule } from '@wizdm/elements/icon';

@NgModule({
  imports: [ 
    CommonModule, 
    MatButtonModule, 
    IconModule
  ],
  declarations: [ ActionComponent ],
  exports: [ ActionComponent ]
})
export class ActionbarModule { }
