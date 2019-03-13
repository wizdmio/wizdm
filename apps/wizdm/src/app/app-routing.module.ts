import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NavComponent } from './navigator/navigator.component';
import { ContentResolver } from './navigator/utils/content-resolver.service';
import { AuthGuardService } from './navigator/utils/auth-guard.service';
import { PageGuardService } from './navigator/utils/page-guard.service';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { TermsPrivacyComponent } from './pages/terms-privacy/terms-privacy.component';
import { LoginComponent } from './pages/login/login.component';
import { HandlerComponent } from './pages/handler/handler.component';
import { UserComponent } from './pages/user/user.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { ApplyComponent } from './pages/apply/apply.component';
import { EditorComponent } from './pages/editor/editor.component';
import { UploadComponent } from './pages/upload/upload.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

// Define navigation routes
const routes: Routes = [

  // Redirection handler (for firebase password confirmation/reset and stuff)
  { path: 'handler', component: HandlerComponent },

  // Global NotFound page using default language content
  { path: 'not-found', component: NotFoundComponent },

  // Redirect to the language resolver asking for auto detection of the explore language
  { path: '', redirectTo: 'auto', pathMatch: 'full' },

  // Load the navigation with the selected language
  { path: ':lang', component: NavComponent,
    
    // Install a resolver to pre-fetch localized data dynamically according to the user preferences
    resolve: { content: ContentResolver },
    // Uses static data to instructs the resolver about the modules to be loaded
    data: { modules: ['navigator', 'errors'] },
    // Localized pages
    children: [
      { 
        path: '', 
        component: HomeComponent, 
        resolve: { content: ContentResolver }, 
        data: { modules: ['home'] }
      },
      { 
        path: 'explore', 
        component: ExploreComponent, 
        resolve: { content: ContentResolver }, 
        data: { modules: ['explore', 'info'] }
      },
      { 
        path: 'about', 
        component: AboutComponent, 
        resolve: { content: ContentResolver }, 
        data: { modules: ['about'] }
      },
      { 
        path: 'login', 
        component: LoginComponent, 
        resolve: { content: ContentResolver }, 
        data: { modules: ['login'] }
      },
      { 
        path: 'terms', 
        component: TermsPrivacyComponent, 
        resolve: { content: ContentResolver }, 
        data: { modules: ['terms'] }
      },
      { path: 'home', redirectTo: '', pathMatch: 'full' },
      { path: 'projects', redirectTo: 'explore', pathMatch: 'full' },

      // Guarded pages requiring authentication
      { path: '', 
        
        canActivateChild: [AuthGuardService],
        
        children: [
          { 
            path: 'profile', 
            component: UserComponent,
            canDeactivate: [ PageGuardService ],
            resolve: { content: ContentResolver }, 
            data: { modules: ['profile', 'uploads'] }
          },
          { 
            path: 'upload', 
            component: UploadComponent,
            resolve: { content: ContentResolver }, 
            data: { modules: ['upload'] }
          },
          { 
            path: 'apply', 
            component: ApplyComponent, 
            canDeactivate: [ PageGuardService ],
            resolve: { content: ContentResolver }, 
            data: { modules: ['apply', 'terms', 'template'] }
          },
          { 
            path: 'documents/:id', 
            component: EditorComponent, 
            canDeactivate: [ PageGuardService ],
            resolve: { content: ContentResolver }, 
            data: { modules: ['editor', 'info'] }
          },
          { 
            path: 'dashboard', 
            component: DashboardComponent, 
            canDeactivate: [ PageGuardService ],
            resolve: { content: ContentResolver }, 
            data: { modules: ['dashboard'] }
          },
          { 
            path: 'messages', 
            component: MessagesComponent,
            resolve: { content: ContentResolver }, 
            data: { modules: ['messages', 'info'] }
          },
          //{ path: 'messages/:id', component: MessagesComponent }
        ]
      },
      // NotFound page with localized translation loaded
      { 
        path: 'not-found', 
        component: NotFoundComponent,
        resolve: { content: ContentResolver },
        data: { modules: ['notFound'] },
    
      },
      // Localized redirector to missing pages
      { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
    ]
  },

  // Global redirector to missing pages
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)//, { onSameUrlNavigation: 'reload'} ),//, { useHash: true });
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
