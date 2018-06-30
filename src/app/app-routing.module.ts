import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NavComponent } from 'app/navigator/navigator.component';
import { HomeComponent } from 'app/pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { TermsPrivacyComponent } from './pages/terms-privacy/terms-privacy.component';
import { LoginComponent } from 'app/pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ApplyComponent } from 'app/pages/apply/apply.component';
import { BrowserComponent } from './pages/browser/browser.component';
import { ProjectComponent } from './pages/project/project.component';
import { NotFoundComponent } from 'app/pages/not-found/not-found.component';
import { HandlerComponent } from 'app/pages/handler/handler.component';

import { ContentResolver, AuthGuardService, PageGuardService } from 'app/core';

// Define navigation routes
const routes: Routes = [

  // Global NotFound page using default language content
  { path: 'not-found', component: NotFoundComponent },

  // Redirection handler (for firebase password confirmation/reset and stuff)
  { path: 'handler', component: HandlerComponent },

  // Redirection to the language resolver
  { path: '', redirectTo: 'en', pathMatch: 'full' },

  // Navigation component
  { path: ':lang', component: NavComponent,
    
    // Uses the content manager resolver to pre-fetch language data
    // to be used by the children pages
    resolve: { lang: ContentResolver },

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
          { path: 'dashboard', component: DashboardComponent },
          { path: 'apply', component: ApplyComponent, canDeactivate: [PageGuardService] },
          { path: 'projects', component: BrowserComponent },
          { path: 'projects/:id', component: ProjectComponent }
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
    RouterModule.forRoot(routes),//, { useHash: true });
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
