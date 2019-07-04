import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { ContentResolver, FirebaseHandler } from './core';
import { NavigatorComponent } from './navigator';

// Define navigation routes
const routes: Routes = [
  // Redirection handler (for firebase password confirmation/reset and stuff)
  { path: 'handler', component: FirebaseHandler },
  // Global NotFound page using default language content
  { path: 'not-found', loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundModule) },
  // Redirect to the language resolver asking for auto detection of the explore language
  { path: '', redirectTo: 'auto', pathMatch: 'full' },
  // Load the navigation with the selected language
  { path: ':lang', component: NavigatorComponent,
    // Install a resolver to pre-fetch localized data dynamically according to the user preferences
    resolve: { content: ContentResolver },
    // Uses static data to instructs the resolver about the content to be loaded
    data: { modules: ['navigator'] },
    // Localized lazily loaded pages
    children: [
      // Home page
      { path: '',            loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
      { path: 'home',        redirectTo:   '', pathMatch: 'full' },

      // Coming soon page
      { path: 'coming-soon', loadChildren: () => import('./pages/coming-soon/coming-soon.module').then(m => m.ComingSoonModule) },
      //{ path: '**',          redirectTo:   'coming-soon', pathMatch: 'full' },
      
      // Active pages
      { path: 'apply',       loadChildren: () => import('./pages/apply/apply.module').then(m => m.ApplyModule) },
      { path: 'explore',     loadChildren: () => import('./pages/explore/explore.module').then(m => m.ExploreModule) },
      { path: 'explore/:id', loadChildren: () => import('./pages/editor/editor.module').then(m => m.EditorModule) },
      { path: 'login',       loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
      { path: 'profile',     loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule) },
      { path: 'upload',      loadChildren: () => import('./pages/upload/upload.module').then(m => m.UploadModule) },
      { path: 'dashboard',   loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'messages',    loadChildren: () => import('./pages/messages/messages.module').then(m => m.MessagesModule) },

      // External links redirection page
      { path: 'redirect',    loadChildren: () => import('./pages/redirect/redirect.module').then(m => m.RedirectModule) },
      
      // Not found page
      { path: 'not-found',   loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundModule) },      

      // Static content pages, redirecting to NotFound when no content is available
      { path: ':name',       loadChildren: () => import('./pages/static/static.module').then(m => m.StaticModule) },      
      //{ path: '**', redirectTo:   'not-found', pathMatch: 'full' }
    ]
  },
  // Global redirector to missing languages
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];

@NgModule({
  declarations: [ FirebaseHandler ],
  imports: [ RouterModule.forRoot(routes)],//, { preloadingStrategy: PreloadAllModules }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
