import { ExtraOptions } from '@angular/router';
import { MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { IpInfoConfig, IP_LIST_CC } from '@wizdm/ipinfo';
import { ContentConfig } from '@wizdm/content';
import { MarkdownConfig } from '@wizdm/markdown';
import { PrismLanguages } from '@wizdm/prism';
import { EmojiConfig } from '@wizdm/emoji/utils';
import { StripeElementsOptions } from '@stripe/stripe-js'

// Defines global common environment variables
export const common = {
  
  // Add configuration specifics
  production: false,

  // Appliaction name
  appname: 'wizdm',

  // Content loading configuration
  content: <ContentConfig>{
    selector: 'lang', 
    source: 'assets/i18n',
    supportedValues: ['en', 'it', 'ru'],
    defaultValue: 'en'
  },

  // Universal Emoji support configuration
  emoji: <EmojiConfig>{
    emojiPath: 'assets/emoji',
    emojiExt: '.png',
    emojiMode: 'auto'
  },

  // IpInfo geo location service configuration
  ipinfo: <IpInfoConfig>{
    // Use iplist.cc as the provider
    provider: IP_LIST_CC
  },

  // Main scroller configuration
  scroll: <ExtraOptions>{ 
    // Anchor scrolling and scroll position restoration are implemented 'per page'
    // making sure the rendering is completed prior to perform the scrolling attempt
    scrollOffset: [0, 80]
  },

  // Global tooltip configuration
  tooltips: <MatTooltipDefaultOptions>{
    showDelay: 1000,
    hideDelay: 0,
    touchendHideDelay: 0
  },

  // Markdown rendering configuration
  markdown: <MarkdownConfig> { 
    commonmark: true, 
    footnotes: true 
  },

  // Prism syntax-highlighting extra languages
  prism: <PrismLanguages> [
    { name: 'scss', load: () => import('prismjs/components/prism-scss') },
    { name: 'typescript', load: () => import('prismjs/components/prism-typescript') },
    { name: 'markdown', load: () => import('prismjs/components/prism-markdown') }
  ],

  // StripeElements styling to fit with the global theme
  stripeElements: <StripeElementsOptions>{

    fonts: [
      { cssSrc: 'https://fonts.googleapis.com/css?family=Ubuntu:400,700' }
    ]
  }
};
