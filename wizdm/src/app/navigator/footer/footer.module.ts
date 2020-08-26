import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
//import { MatDividerModule } from '@angular/material/divider';
import { ContentModule } from '@wizdm/content';
import { MomentPipesModule } from '@wizdm/pipes/moment';
import { IconModule } from '@wizdm/elements/icon';
import { LogoModule } from '@wizdm/elements/logo';
import { FooterComponent } from './footer.component';

@NgModule({
  
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MatButtonModule,
    MatMenuModule,
    ContentModule,
    MomentPipesModule,
    IconModule,
    LogoModule
  ],
  declarations: [
    FooterComponent
  ],
  exports: [
    FooterComponent
  ]
})
export class FooterModule { }
