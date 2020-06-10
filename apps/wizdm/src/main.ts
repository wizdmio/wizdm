import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if(environment.production) {

  // Disables logs to console
  window['console']['log'] = () => {};
  
  // Enables Angular's production mode
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule/*, { ngZoneEventCoalescing: true }*/)
  .catch(err => console.error(err));
