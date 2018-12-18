import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { ContentResolver } from '@wizdm/content';

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
import { ApplyComponent } from './pages/apply/apply.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectComponent } from './pages/project/project.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { UploadComponent } from './pages/upload/upload.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

// Define navigation routes
const routes: Routes = [

  // Global NotFound page using default language content
  { path: 'not-found', component: NotFoundComponent },

  // Redirection handler (for firebase password confirmation/reset and stuff)
  { path: 'handler', component: HandlerComponent },

  // Redirect to the language resolver asking for auto detection of the explore language
  { path: '', redirectTo: 'auto', pathMatch: 'full' },

  // Load the navigation with the selected language
  { path: ':lang', component: NavComponent,
    
    // Install a resolver to pre-fetch language data according to the user preferences
    resolve: { lang: ContentResolver },

    // Localized pages
    children: [

      { path: '', component: HomeComponent },
      { path: 'explore', component: ExploreComponent },
      { path: 'about', component: AboutComponent },
      { path: 'login', component: LoginComponent },
      { path: 'terms', component: TermsPrivacyComponent },

      { path: 'home', redirectTo: '', pathMatch: 'full' },
      { path: 'projects', redirectTo: 'explore', pathMatch: 'full' },

      // Guarded pages requiring authentication
      { path: '', 
        
        canActivateChild: [AuthGuardService],
        
        children: [
          { path: 'profile', component: UserComponent, canDeactivate: [PageGuardService] },
          { path: 'dashboard', component: DashboardComponent, canDeactivate: [PageGuardService] },
          { path: 'apply', component: ApplyComponent, canDeactivate: [PageGuardService] },
          { path: 'projects/:id', component: ProjectComponent, canDeactivate: [PageGuardService] },
          { path: 'upload', component: UploadComponent }, //, canDeactivate: [PageGuardService] },
          { path: 'messages', component: MessagesComponent }, //, canDeactivate: [PageGuardService] },
          //{ path: 'messages/:id', component: MessagesComponent }, //, canDeactivate: [PageGuardService] }
        ]
      },
    
      // NotFound page with localized translation loaded
      { path: 'not-found', component: NotFoundComponent },
      
      // Localized redirector to missing pages
      { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
    ]
  },

  // Global redirector to missing pages unlocalized
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
