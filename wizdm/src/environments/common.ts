import { ExtraOptions } from '@angular/router';
import { MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { IpInfoConfig, IP_LIST_CC } from '@wizdm/ipinfo';
import { ContentConfig } from '@wizdm/content';
import { EmojiConfig } from '@wizdm/emoji/utils';
import { StripeElementsOptions } from '@stripe/stripe-js'

// Defines global common environment variables
export const common = {
  
  // Add configuration specifics
  production: false,

  appname: 'wizdm',

  content: <ContentConfig>{
    selector: 'lang', 
    source: 'assets/i18n',
    supportedValues: ['en', 'it', 'ru'],
    defaultValue: 'en'
  },

  emoji: <EmojiConfig>{
    emojiPath: 'assets/emoji',
    emojiExt: '.png',
    emojiMode: 'auto'
  },

  ipinfo: <IpInfoConfig>{
    // Use iplist.cc as the provider
    provider: IP_LIST_CC
  },

  scroll: <ExtraOptions>{ 
    // Anchor scrolling and scroll position restoration are implemented 'per page'
    // making sure the rendering is completed prior to perform the scrolling attempt
    scrollOffset: [0, 80]
  },

  tooltips: <MatTooltipDefaultOptions>{
    showDelay: 1000,
    hideDelay: 0,
    touchendHideDelay: 0
  },

  // StripeElements styling to fit with the global theme
  stripeElements: <StripeElementsOptions>{

    fonts: [
      { cssSrc: 'https://fonts.googleapis.com/css?family=Ubuntu:400,700' }
    ]
  }
};
