import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ActionComponent } from './action/action.component';
import { ActionbarDirective } from './actionbar.directive';
import { IconModule } from '@wizdm/elements/icon';
import { DialogModule } from '@wizdm/elements/dialog';

@NgModule({
  imports: [ 
    CommonModule, 
    MatButtonModule, 
    IconModule,
    DialogModule
  ],
  declarations: [ 
    ActionComponent, 
    ActionbarDirective 
  ],
  exports: [ 
    ActionComponent, 
    ActionbarDirective 
  ]
})
export class ActionbarModule { }
