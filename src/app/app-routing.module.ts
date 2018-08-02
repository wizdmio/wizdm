import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NavComponent } from './navigator/navigator.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { TermsPrivacyComponent } from './pages/terms-privacy/terms-privacy.component';
import { LoginComponent } from './pages/login/login.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { ApplyComponent } from './pages/apply/apply.component';
import { ProjectBrowserComponent } from './pages/project-browser/project-browser.component';
import { ProjectComponent } from './pages/project-browser/project/project.component';
import { PeopleBrowserComponent } from './pages/people-browser/people-browser.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HandlerComponent } from './pages/handler/handler.component';

import { ResolverService, AuthGuardService, PageGuardService } from './core';

// Define navigation routes
const routes: Routes = [

  // Global NotFound page using default language content
  { path: 'not-found', component: NotFoundComponent },

  // Redirection handler (for firebase password confirmation/reset and stuff)
  { path: 'handler', component: HandlerComponent },

  // Redirect to the language resolver asking for auto detection of the browser language
  { path: '', redirectTo: 'auto', pathMatch: 'full' },

  // Load the navigation with the selected language
  { path: ':lang', component: NavComponent,
    
    // Uses the content manager resolver to pre-fetch language data to be used by the children pages
    resolve: { lang: ResolverService },

    // Localized pages
    children: [
    
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      { path: 'home', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'terms', component: TermsPrivacyComponent },
      { path: 'login', component: LoginComponent },

      // Guarded pages requiring authentication
      { path: '', 
        
        canActivateChild: [AuthGuardService],
        
        children: [
          { path: 'profile', component: UserProfileComponent, canDeactivate: [PageGuardService] },
          { path: 'apply', component: ApplyComponent, canDeactivate: [PageGuardService] },
          { path: 'projects', component: ProjectBrowserComponent, canDeactivate: [PageGuardService] },
          { path: 'projects/:id', component: ProjectComponent, canDeactivate: [PageGuardService] },
          { path: 'people', component: PeopleBrowserComponent, canDeactivate: [PageGuardService] }
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
