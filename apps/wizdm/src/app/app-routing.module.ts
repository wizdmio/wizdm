import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { NavComponent } from './navigator';
import { ContentResolver, FirebaseHandler } from './core';

// Define navigation routes
const routes: Routes = [
  // Redirection handler (for firebase password confirmation/reset and stuff)
  { path: 'handler', component: FirebaseHandler },
  // Global NotFound page using default language content
  { path: 'not-found', loadChildren: './pages/not-found/not-found.module#NotFoundModule' },
  // Redirect to the language resolver asking for auto detection of the explore language
  { path: '', redirectTo: 'auto', pathMatch: 'full' },
  // Load the navigation with the selected language
  { path: ':lang', component: NavComponent,
    // Install a resolver to pre-fetch localized data dynamically according to the user preferences
    resolve: { content: ContentResolver },
    // Uses static data to instructs the resolver about the content to be loaded
    data: { modules: ['navigator'] },
    // Localized lazily loaded pages
    children: [
      { path: '',            loadChildren: './pages/home/home.module#HomeModule' },

      //{ path: '**',          redirectTo:   'coming-soon', pathMatch: 'full' },
      
      { path: 'apply',       loadChildren: './pages/apply/apply.module#ApplyModule' },
      { path: 'explore',     loadChildren: './pages/explore/explore.module#ExploreModule' },
      { path: 'explore/:id', loadChildren: './pages/editor/editor.module#EditorModule' },
      { path: 'login',       loadChildren: './pages/login/login.module#LoginModule' },
      { path: 'profile',     loadChildren: './pages/profile/profile.module#ProfileModule' },
      { path: 'upload',      loadChildren: './pages/upload/upload.module#UploadModule' },
      { path: 'dashboard',   loadChildren: './pages/dashboard/dashboard.module#DashboardModule' },
      { path: 'messages',    loadChildren: './pages/messages/messages.module#MessagesModule' },
      { path: 'docs/:name',  loadChildren: './pages/static/static.module#StaticModule' },
      { path: 'not-found',   loadChildren: './pages/not-found/not-found.module#NotFoundModule' },
      { path: 'redirect',    loadChildren: './pages/redirect/redirect.module#RedirectModule' },
      { path: 'coming-soon', loadChildren: './pages/coming-soon/coming-soon.module#ComingSoonModule' },
      // Redirections
      { path: 'home',        redirectTo:   '', pathMatch: 'full' },
      { path: '**',          redirectTo:   'not-found', pathMatch: 'full' }
    ]
  },
  // Global redirector to missing pages
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];

@NgModule({
  declarations: [ FirebaseHandler ],
  imports: [ RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
