import { ExtraOptions } from '@angular/router';
import { MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { StripeElementsConfig } from '@wizdm/stripe/elements';
import { IpInfoConfig, IP_LIST_CC } from '@wizdm/ipinfo';
import { ContentConfig } from '@wizdm/content';
import { EmojiConfig } from '@wizdm/emoji/utils';

export const appname: string = 'wizdm';

export const content: ContentConfig = {
  selector: 'lang', 
  source: 'assets/i18n',
  supportedValues: ['en', 'it', 'ru'],
  defaultValue: 'en'
};

export const emoji: EmojiConfig = {
  emojiPath: 'assets/emoji',
  emojiExt: '.png',
  emojiMode: 'auto'
};

export const ipinfo: IpInfoConfig = {
  // Use iplist.cc as the provider
  provider: IP_LIST_CC
}

export const scroll: ExtraOptions = { 
  // Anchor scrolling and scroll position restoration are implemented 'per page'
  // making sure the rendering is completed prior to perform the scrolling attempt
  scrollPositionRestoration: 'disabled',
  anchorScrolling: 'disabled',
  scrollOffset: [0, 80]
};

export const tooltips: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 0,
  touchendHideDelay: 0
};

// StripeElements styling to fit with the global theme
export const stripeElements: StripeElementsConfig = {

  elementsOptions: {
    fonts: [
      { cssSrc: 'https://fonts.googleapis.com/css?family=Ubuntu:400,700' }
    ]
  },
  style: {
    base: {
      fontFamily: 'Ubuntu, sans-serif'
    }
  }
};