import { Injectable, Inject, InjectionToken, Optional } from '@angular/core';

export const ContentConfigToken = new InjectionToken<ContentConfig>('wizdm.content.config');

export interface ContentConfig {
  selector?: string;          // 'lang'
  contentRoot?: string;       // 'assets/i18n'
  defaultValue?: string;      // 'en'
  supportedValues?: string[]; // ['en']
}

@Injectable()
export class ContentConfigurator implements ContentConfig {

  constructor(@Optional() @Inject(ContentConfigToken) readonly config: ContentConfig) {}

  /** Returns the route selector (aka param name) as per the config */
  public get selector(): string { return !!this.config && this.config.selector || 'lang'; }
  /** Returns the root path of the content json files as per the config */
  public get contentRoot(): string { return !!this.config && this.config.contentRoot || 'assets/i18n'; }
  /** Returns the default language code as per the config */
  public get defaultValue(): string { return !!this.config && this.config.defaultValue || 'en'; }
  /** Returns the optional array of supported languages */
  public get supportedValues(): string[] { return !!this.config && this.config.supportedValues || [this.defaultValue]; }
}
