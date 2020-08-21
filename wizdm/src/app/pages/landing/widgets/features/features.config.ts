import type { WidgetConfig, WidgetAnimationConfig } from '../base-widget.directive';
import type { wmAnimations } from '@wizdm/animate';

export interface FeaturesConfig extends WidgetConfig {

  type: 'feature-matrix',

  features: FeatureConfig[];

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