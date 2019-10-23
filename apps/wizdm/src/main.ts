import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Include HammerJS to support gestures (used by Material)
import 'hammerjs';

// Includes a subset of languages to support syntax highlighting t. Checkout Prism.js to add more
/* import 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-typescript';
*/

// Augment global objects with useful functions
import './app/core/augment/string/camelize';
import './app/core/augment/string/hyphenize';
import './app/core/augment/string/interpolate';
import './app/core/augment/string/select'
//import './app/core/augment/string/printf';
//import './app/core/augment/math/normal';
//import './app/core/augment/array//shuffle';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
