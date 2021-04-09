import { common } from './common';
import { secrets } from './secrets';

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --prod` then `environment.prod.ts` will be used instead.
// Both versions includes common.ts sharing the same common definitions.
export const environment = {

  // Shares the same configurations...
  ...common, ...secrets,

  // Enables emulators on request
  emulators: {

    // Uncomment to enable the relevant emulator
    //auth:      'localhost:9099',
    //firestore: 'localhost:8080',
    //functions: 'localhost:5001'
  },
  
  // Disables production mode (aka debug mode)
  production: false
};
