import { ConnectConfig } from '@wizdm/connect';
import { DoorbellConfig } from '@wizdm/doorbell';
import { GtagConfig } from '@wizdm/gtag';

// Defines global secret environment variables
export const secrets = {

  rootEmail: '<< your root access email goes here >>',

  // We use the test key while in development, live key for production
  stripeTestKey: '<< your pk_test_... key goes here >>',
  stripeLiveKey: '<< your pk_live_... key goes here >>',

  firebase: <ConnectConfig> {
    apiKey: "<< YOUR FIREBASE API KEY HERE >>",
    authDomain: "<< your firebase auth domain here >>",
    databaseURL: "<< your firebase database url here >>",
    projectId: "<< your firebase project id here >>",
    storageBucket: "<< your firebase storage bucked here >>",
    messagingSenderId: "<< YOUR FIREBASE MESSAGE SENDER ID HERE >>"
  },

  doorbell: <DoorbellConfig> {
    url: "https://doorbell.io/api/applications",
    id: "<< your doorbell id here >>",
    appKey: "<< your doorbell app key here >>"  
  },

  gtag: <GtagConfig> {
    targetId: '<< YOUR GA MEASURE ID HERE >>'
  }
};
