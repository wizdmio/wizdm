import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { IconModule } from '../../elements/icon';
import { ToolbarService } from './toolbar.service';
import { ToolbarComponent } from './toolbar.component';
import { ActionComponent } from './action/action.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MatButtonModule,
    MatMenuModule,
    IconModule, 
  ],
  declarations: [
    ToolbarComponent,
    ActionComponent
  ],
  exports: [
    ToolbarComponent
  ],
  providers: [
    ToolbarService
  ]
})
export class ToolbarModule { }
