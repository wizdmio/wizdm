import type { WidgetConfig, WidgetAnimationConfig } from '../base-widget.directive';
import type { ThemePalette } from '@angular/material/core';
import type { wmAnimations } from '@wizdm/animate';

export interface FeaturesConfig extends WidgetConfig {

  type: 'feature-matrix',

  features: FeatureConfig[];

  linkColor?: ThemePalette;

  defaultAnimation?: wmAnimations;
};

export interface FeatureConfig {

  icon: string;
  title: string;
  description: string;
  
  url?: string;

  comingSoon?: boolean;
  experimental?: boolean;

  animation?: wmAnimations;
};