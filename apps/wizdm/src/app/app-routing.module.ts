import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavComponent } from './navigator';
import { ContentResolver, RedirectHandler } from './utils';

// Define navigation routes
const routes: Routes = [
  // Redirection handler (for firebase password confirmation/reset and stuff)
  { path: 'handler', component: RedirectHandler },
  // Global NotFound page using default language content
  { path: 'not-found', loadChildren: './pages/not-found/not-found.module#NotFoundModule' },
  // Redirect to the language resolver asking for auto detection of the explore language
  { path: '', redirectTo: 'auto', pathMatch: 'full' },
  // Load the navigation with the selected language
  { path: ':lang', component: NavComponent,
    // Install a resolver to pre-fetch localized data dynamically according to the user preferences
    resolve: { content: ContentResolver },
    // Uses static data to instructs the resolver about the modules to be loaded
    data: { modules: ['navigator', 'errors'] },
    // Localized lazily loaded pages
    children: [
      { path: '',            loadChildren: './pages/home/home.module#HomeModule' },
      { path: 'apply',       loadChildren: './pages/apply/apply.module#ApplyModule' },
      { path: 'explore',     loadChildren: './pages/explore/explore.module#ExploreModule' },
      { path: 'explore/:id', loadChildren: './pages/editor/editor.module#EditorModule' },
      { path: 'about',       loadChildren: './pages/about/about.module#AboutModule' },
      { path: 'login',       loadChildren: './pages/login/login.module#LoginModule' },
      { path: 'profile',     loadChildren: './pages/user/user.module#UserModule' },
      { path: 'upload',      loadChildren: './pages/upload/upload.module#UploadModule' },
      { path: 'dashboard',   loadChildren: './pages/dashboard/dashboard.module#DashboardModule' },
      { path: 'messages',    loadChildren: './pages/messages/messages.module#MessagesModule' },
      { path: 'terms',       loadChildren: './pages/terms-privacy/terms-privacy.module#TermsPrivacyModule' },
      { path: 'not-found',   loadChildren: './pages/not-found/not-found.module#NotFoundModule' },
      // Redirections
      { path: 'home',        redirectTo:   '', pathMatch: 'full' },
      { path: '**',          redirectTo:   'not-found', pathMatch: 'full' }
    ]
  },
  // Global redirector to missing pages
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];

@NgModule({
  declarations: [ RedirectHandler ],
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
