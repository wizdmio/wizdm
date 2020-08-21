import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { RedirectModule } from '@wizdm/redirect';
import { AnimateModule } from '@wizdm/animate';
//import { IconModule } from '@wizdm/elements/icon';
import { ReadmeModule } from '@wizdm/readme';
import { ButtonChangerModule } from '@wizdm/elements/button';
import { IllustrationModule } from '@wizdm/elements/illustration';
import { WidgetDirective } from '../base-widget.directive';
import { Component, NgModule } from '@angular/core';
import { BannerConfig } from './banner.config';

@Component({
  selector: 'wm-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  host: { '[style.min-height.px]': "config.minHeight || undefined" }
})
export class BannerComponent extends WidgetDirective<BannerConfig> {}

@NgModule({
  declarations: [ BannerComponent ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MatButtonModule,
    RedirectModule,
    AnimateModule,
    ReadmeModule,
    ButtonChangerModule,
    IllustrationModule
  ]
})
export class BannerModule { }
