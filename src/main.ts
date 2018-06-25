import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Import hammerjs to enable gestures for AngularMaterial
import 'hammerjs';

// Import handy utils to extend global objects with useful functions
import 'app/utils/handy/naming';
import 'app/utils/handy/interpolate';
//import 'app/utils/handy/printf';
//import 'app/utils/handy/normal';
//import 'app/utils/handy/shuffle';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
