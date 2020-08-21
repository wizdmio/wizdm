import type { WidgetConfig, WidgetAnimationConfig } from '../base-widget.directive';
import type { ThemePalette } from '@angular/material/core';
import type { ButtonType } from '@wizdm/elements/button';

export interface BannerConfig extends WidgetConfig {

  type: 'banner',

  textbox?: {

    order?: number;

    title: string;
    pitch: string;

    action?: {

      caption: string;
      link: string;

      color?: ThemePalette;
      type?: ButtonType;      
      hint?: string;
    },

    animation?: WidgetAnimationConfig;
  },

  illustration?: {

    order?: number;

    source: string;
    color?: ThemePalette;

    animation?: WidgetAnimationConfig;
  }
};