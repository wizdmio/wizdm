import { NgModule } from '@angular/core';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { RedirectService } from '@wizdm/redirect';
import { LanguageSelector } from 'app/utils/lang-selector';
import { Oauth2Handler } from 'app/utils/oauth2-handler';
import { ActionLinkObserver } from 'app/utils/action-link';
import { NavigatorComponent } from './navigator.component';

const routes: RoutesWithContent = [

  // Redirects handler page (for firebase password confirmation/reset and stuff)
  { path: 'handler', canActivate: [ Oauth2Handler ] },

  // External links redirection helper
  { path: 'redirect', canActivate: [ RedirectService ] },
  
  // Enables language autodetection on empty routes
  { path: '', redirectTo: 'auto', pathMatch: 'full' },
  
  // Loads te main window (navigator) together with the localized content 
  {
    path: ':lang',
    
    component: NavigatorComponent,
    
    canActivate: [ LanguageSelector ],
    
    content: ['navigator', 'footer', 'login', 'feedback'],
    
    children: [
      
      // Home page
      { path: '', loadChildren: () => import('../pages/home/home.module').then(m => m.HomeModule) },
      { path: 'home', redirectTo: '', pathMatch: 'full' },

      // Redirecs to coming soon page
      // { path: '**',          redirectTo:   'coming-soon', pathMatch: 'full' },
      
      // Active pages
      { path: 'apply',       loadChildren: () => import('../pages/apply/apply.module').then(m => m.ApplyModule) },
      { path: 'explore',     loadChildren: () => import('../pages/explore/explore.module').then(m => m.ExploreModule) },
      //{ path: 'explore/:id', loadChildren: () => import('../pages/editor/editor.module').then(m => m.EditorModule) },
      { path: 'profile',     loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfileModule) },
      //{ path: 'folder',      loadChildren: () => import('../pages/folder/folder.module').then(m => m.FolderModule) },
      { path: 'docs/:name',  loadChildren: () => import('../pages/static/static.module').then(m => m.StaticModule) },

      // Intercepts routing "action-links" to execute a non-routing action
      { path: 'login',       canActivate: [ ActionLinkObserver ] },
      { path: 'contact',     canActivate: [ ActionLinkObserver ] },
      { path: 'back',        canActivate: [ ActionLinkObserver ] },
      
      // Not found page
      { path: 'not-found',   loadChildren: () => import('../pages/not-found/not-found.module').then(m => m.NotFoundModule) },      

      // Static content pages, redirecting to NotFound when no content is available
      { path: ':name',       loadChildren: () => import('../pages/static/static.module').then(m => m.StaticModule) }
    ]
  }
];

@NgModule({
  imports: [ ContentRouterModule.forChild(routes) ],
  exports: [ ContentRouterModule ],
  providers: [ LanguageSelector ]
})
export class NavRoutingModule {}