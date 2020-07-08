import { ConnectConfig } from '@wizdm/connect';
import { DoorbellConfig } from '@wizdm/doorbell';
import { GtagConfig } from '@wizdm/gtag';

export const rootEmail = 'rootEmail@your-domain.io';

export const firebase: ConnectConfig = {
  apiKey: "<< YOUR FIREBASE API KEY HERE >>",
  authDomain: "<< your firebase auth domain here >>",
  databaseURL: "<< your firebase database url here >>",
  projectId: "<< your firebase project id here >>",
  storageBucket: "<< your firebase storage bucked here >>",
  messagingSenderId: "<< YOUR FIREBASE MESSAGE SENDER ID HERE >>"
};

export const doorbell: DoorbellConfig = {
  url: "https://doorbell.io/api/applications",
  id: "<< your doorbell id here >>",
  appKey: "<< your doorbell app key here >>"  
};

export const gtag: GtagConfig = {
  targetId: '<< YOUR GA MEASURE ID HERE >>'
};
