// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --prod` then `environment.prod.ts` will be used instead.
// Both versions includes common.ts sharing the same common definitions.

import { common } from './common';

export const environment = {

  ...common,
  
  // Add configuration specifics
  production: false
};
