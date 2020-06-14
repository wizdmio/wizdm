import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { BackLinkObserver, CloseLinkObserver } from './providers/action-links';
import { LanguageSelector, WelcomeBack } from './providers/lang-selector';
import { NavigatorComponent } from './navigator.component';
import { Oauth2Handler } from './providers/oauth2-handler';
import { ActionLinkObserver } from '@wizdm/actionlink';
import { RedirectService } from '@wizdm/redirect';
import { NgModule } from '@angular/core';

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
    
    canActivate: [ WelcomeBack, LanguageSelector ],
    
    content: ['navigator', 'login', 'feedback'],
    
    children: [

      // Landing page
      { path: '',            loadChildren: () => import('../pages/landing/landing.module').then(m => m.LandingModule) },
      { path: 'home',        redirectTo: '', pathMatch: 'full' },
      
      // Content browsing
      { path: 'explore',     loadChildren: () => import('../pages/explore/explore.module').then(m => m.ExploreModule) },
      { path: 'welcome-back',redirectTo: 'explore', pathMatch: 'full' },      

      // Instant messaging
      { path: 'chat',        loadChildren: () => import('../pages/chat/chat.module').then(m => m.ChatModule) },

      // Profile settings
      { path: 'settings',    loadChildren: () => import('../pages/settings/settings.module').then(m => m.SettingsModule) },

      // Action links
      { path: 'login',       canActivate: [ ActionLinkObserver ] },
      { path: 'contact',     canActivate: [ ActionLinkObserver ] },
      { path: 'back',        canActivate: [ BackLinkObserver ] },
      { path: 'close',       canActivate: [ CloseLinkObserver ] },
      
      // Not found page
      { path: 'not-found',   loadChildren: () => import('../pages/not-found/not-found.module').then(m => m.NotFoundModule) },

      // Reference (using static docs subfolder)
      { path: 'docs',        redirectTo: 'docs/start', pathMatch: 'full' },
      { path: 'docs/toc',    canActivate: [ ActionLinkObserver ], data: { actionMatch: 'toc' } },

      // Static content pages (about, terms, docs/...), redirecting to NotFound when no content is available
      { path: ':path',       loadChildren: () => import('../pages/static/static.module').then(m => m.StaticModule) },

      // Anything else will route to not found
      { path: '**',          redirectTo: 'not-found' }
    ]
  }
];

@NgModule({
  imports: [ ContentRouterModule.forChild(routes) ],
  exports: [ ContentRouterModule ],
  providers: [ WelcomeBack, LanguageSelector ]
})
export class NavRoutingModule {}
