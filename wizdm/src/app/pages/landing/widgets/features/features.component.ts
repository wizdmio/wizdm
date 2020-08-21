import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RedirectModule } from '@wizdm/redirect';
import { AnimateModule } from '@wizdm/animate';
import { IconModule } from '@wizdm/elements/icon';
import { ReadmeModule } from '@wizdm/readme';
import { WidgetDirective } from '../base-widget.directive';
import { Component, NgModule } from '@angular/core';
import { FeaturesConfig } from './features.config';

@Component({
  selector: 'wm-feature-matrix',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent extends WidgetDirective<FeaturesConfig> {}

@NgModule({
  declarations: [ FeaturesComponent ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    RedirectModule,
    AnimateModule,
    IconModule,
    ReadmeModule
  ]
})
export class FeaturesModule { }
