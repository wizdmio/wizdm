import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ContentModule } from '@wizdm/content';
import { IconModule } from '../../elements/icon';
import { LinkModule } from '../../elements/link';
import { FooterComponent } from './footer.component';


@NgModule({
  
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDividerModule,
    ContentModule,
    IconModule,
    LinkModule
  ],
  declarations: [
    FooterComponent
  ],
  exports: [
    FooterComponent
  ]
})
export class FooterModule { }
