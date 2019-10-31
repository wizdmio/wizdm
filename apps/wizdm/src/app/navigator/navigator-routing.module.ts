import { NgModule } from '@angular/core';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { LanguageSelector, ActionLinkObserver } from '../utils';
import { NavigatorComponent } from './navigator.component';

const routes: RoutesWithContent = [

  // Redirects handler page (for firebase password confirmation/reset and stuff)
  //{ path: 'handler', loadChildren: () => import('../pages/handler/handler.module').then(m => m.HandlerModule) },
  
  // Enables language autodetection on empty routes
  { path: '', redirectTo: 'auto', pathMatch: 'full' },
  
  // Loads te main window (navigator) together with the localized content 
  {
    path: ':lang',
    
    component: NavigatorComponent,
    
    canActivate: [ LanguageSelector ],
    
    content:['navigator', 'footer', 'feedback'],
    
    children: [
      
      // Home page
      { path: '', loadChildren: () => import('../pages/home/home.module').then(m => m.HomeModule) },
      { path: 'home', redirectTo: '', pathMatch: 'full' },

      // Redirecs to coming soon page
      // { path: '**',          redirectTo:   'coming-soon', pathMatch: 'full' },
      
      // Active pages
      { path: 'apply',       loadChildren: () => import('../pages/apply/apply.module').then(m => m.ApplyModule) },
      { path: 'explore',     loadChildren: () => import('../pages/explore/explore.module').then(m => m.ExploreModule) },
      { path: 'explore/:id', loadChildren: () => import('../pages/editor/editor.module').then(m => m.EditorModule) },
      { path: 'login',       loadChildren: () => import('../pages/login/login.module').then(m => m.LoginModule) },
      { path: 'profile',     loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfileModule) },
      { path: 'folder',      loadChildren: () => import('../pages/folder/folder.module').then(m => m.FolderModule) },

      // External links redirection page
      { path: 'redirect',    loadChildren: () => import('../pages/redirect/redirect.module').then(m => m.RedirectModule) },

      // Intercepts routing "action-links" to execute a non-routing action
      { path: 'contact',     canActivate: [ ActionLinkObserver ], data: { action: 'feedback' } },
      { path: 'edit',        canActivate: [ ActionLinkObserver ], data: { action: 'edit' } },
      
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