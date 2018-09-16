import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Import handy utils to extend global objects with useful functions
import './app/utils/naming';
import './app/utils/interpolate';
import './app/utils/select'
//import './app/utils/printf';
//import './app/utils/normal';
//import './app/utils/shuffle';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
