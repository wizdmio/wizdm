import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Define navigation routes
const routes: Routes = [
  
  // Redirection handler page (for firebase password confirmation/reset and stuff)
  { path: 'handler', loadChildren: () => import('./pages/handler/handler.module').then(m => m.HandlerModule) },
  
  // Global NotFound page using default language content
  { path: 'not-found', loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundModule) },
  
  // Loads the navigator resolving the requested language or redirects to the language auto detection
  { path: ':lang', loadChildren: () => import('./navigator/navigator.module').then(m => m.NavigatorModule) },
  { path: '', redirectTo: 'auto', pathMatch: 'full' },

  // Global redirector to missing languages
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { anchorScrolling: 'enabled' }) ],
  exports: [ RouterModule ],
  providers: [
    //{ provide: APP_BASE_HREF, useValue: '/' }
  ]
})
export class AppRoutingModule {}
