import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentResolver } from '../core';
import { NavigatorComponent } from './navigator.component';

const routes: Routes = [
  {
    path: '',
    component: NavigatorComponent,
    resolve: { content: ContentResolver }, 
    data: { i18n: ['navigator', 'feedback'] },
    // Localized pages
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
      
      // Not found page
      { path: 'not-found',   loadChildren: () => import('../pages/not-found/not-found.module').then(m => m.NotFoundModule) },      

      // Static content pages, redirecting to NotFound when no content is available
      { path: ':name',       loadChildren: () => import('../pages/static/static.module').then(m => m.StaticModule) },      
      //{ path: '**', redirectTo:   'not-found', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [ ],
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class NavRoutingModule {}