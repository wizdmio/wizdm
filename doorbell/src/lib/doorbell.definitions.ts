import { InjectionToken } from '@angular/core';

export interface DoorbellConfig {
  url    : string,//'https://doorbell.io/api/applications'
  id     : string,//'your id here',
  appKey : string,//'your key here'
};

export interface DoorbellSubmit {
  email        : string,
  message      : string,
  name?        : string
  ip?          : string,
  sentiment?   : 'positive'|'neutral'|'negative',
  tags?        : string|string[],
  properties?  : { [key: string]: string },
  //attachments? : number[], Automatically filled up by the uploader()
  nps?         : number,
  language?    : string
};

export const DoorbellConfigToken = new InjectionToken<DoorbellConfig>('wizdm.doorbel.config');