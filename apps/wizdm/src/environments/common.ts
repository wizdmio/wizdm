import { ExtraOptions } from '@angular/router';
import { ContentConfig } from '@wizdm/content';
import { TeleportConfig } from '@wizdm/teleport';
import { EmojiConfig } from '@wizdm/emoji';
import { IpInfoConfig, IP_LIST_CC } from '@wizdm/ipinfo';

export const appname: string = 'wizdm';

export const content: ContentConfig = {
  selector: 'lang', 
  source: 'assets/i18n',
  supportedValues: ['en', 'it', 'ru'],
  defaultValue: 'en'
};

export const teleport: TeleportConfig = {
  bufferSize: 1
};

export const emoji: EmojiConfig = {
  emojiPath: 'assets/emoji',
  emojiExt: '.png'
  //emojiMode: 'auto'
};

export const ipinfo: IpInfoConfig = {
  // Use iplist.cc as the provider
  provider: IP_LIST_CC
}

export const router: ExtraOptions = { 
  // Anchor scrolling and scroll position restoration are overidden by the AppComponent
  // making sure the rendering is completed prior to perform the scrolling attempt
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 80]
};
