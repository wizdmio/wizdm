import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { IconModule } from '@wizdm/elements/icon';
import { ActionComponent } from './action.component';
import { ActionbarDirective } from './actionbar.directive';

@NgModule({
  imports: [ 
    CommonModule, 
    MatButtonModule, 
    IconModule
  ],
  declarations: [ ActionComponent, ActionbarDirective ],
  exports: [ ActionComponent, ActionbarDirective ]
})
export class ActionbarModule { }
