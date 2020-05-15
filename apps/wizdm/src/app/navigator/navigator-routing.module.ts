import { NgModule } from '@angular/core';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { RedirectService } from '@wizdm/redirect';
import { ActionLinkObserver } from '@wizdm/actionlink';
import { NavigatorComponent } from './navigator.component';
import { LanguageSelector } from './lang-selector';
import { BackLinkObserver } from './back-link';
import { CloseLinkObserver } from './close-link';
import { Oauth2Handler } from '../auth/oauth2-handler';

const routes: RoutesWithContent = [

  // Auth handler (for firebase password confirmation/reset and stuff)
  { path: 'auth/action', pathMatch: 'full', canActivate: [ Oauth2Handler ] },

  // External links redirection helper
  { path: 'redirect', canActivate: [ RedirectService ] },
  
  // Enables language autodetection on empty routes
  { path: '', redirectTo: 'auto', pathMatch: 'full' },
  
  // Loads te main window (navigator) together with the localized content 
  {
    path: ':lang',
    
    component: NavigatorComponent,
    
    canActivate: [ LanguageSelector ],
    
    content: ['navigator', 'login', 'feedback'],
    
    children: [
      
      // Home page
      { path: '', loadChildren: () => import('../pages/home/home.module').then(m => m.HomeModule) },
      { path: 'home', redirectTo: '', pathMatch: 'full' },

      // Active pages
      //{ path: 'apply',       loadChildren: () => import('../pages/apply/apply.module').then(m => m.ApplyModule) },
      { path: 'profile',     loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfileModule) },
      { path: 'features',     loadChildren: () => import('../pages/features/features.module').then(m => m.FeaturesModule) },
      { path: 'chat',        loadChildren: () => import('../pages/chat/chat.module').then(m => m.ChatModule) },
      //{ path: 'folder',      loadChildren: () => import('../pages/folder/folder.module').then(m => m.FolderModule) },
      
      // Reference
      { path: 'docs',        redirectTo: 'docs/start', pathMatch: 'full' },
      { path: 'docs/toc',    canActivate: [ ActionLinkObserver ], data: { actionMatch: 'toc' } },
      { path: 'docs/:path',  loadChildren: () => import('../pages/static/static.module').then(m => m.StaticModule) },

      // Intercepts routing "action-links" to execute a non-routing action
      { path: 'login',       canActivate: [ ActionLinkObserver ] },
      { path: 'contact',     canActivate: [ ActionLinkObserver ] },
      { path: 'back',        canActivate: [ BackLinkObserver ] },
      { path: 'close',       canActivate: [ CloseLinkObserver ] },
      
      // Not found page
      { path: 'not-found',   loadChildren: () => import('../pages/not-found/not-found.module').then(m => m.NotFoundModule) },

      // Static content pages, redirecting to NotFound when no content is available
      { path: ':path',       loadChildren: () => import('../pages/static/static.module').then(m => m.StaticModule) },

      // Anything else will route to not found
      { path: '**',          redirectTo: 'not-found' }
    ]
  }
];

@NgModule({
  imports: [ ContentRouterModule.forChild(routes) ],
  exports: [ ContentRouterModule ],
  providers: [ LanguageSelector ]
})
export class NavRoutingModule {}
