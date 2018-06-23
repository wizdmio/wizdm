import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NavComponent } from 'app/navigator/navigator.component';
import { HomeComponent } from 'app/pages/home/home.component';
import { LoginComponent } from 'app/pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ApplyComponent } from 'app/pages/apply/apply.component';
import { BrowserComponent } from './pages/browser/browser.component';
import { ProjectComponent } from './pages/project/project.component';

import { NotFoundComponent } from 'app/pages/not-found/not-found.component';

import { ContentResolver } from 'app/core';

// Define navigation routes
const routes: Routes = [

  // Global NotFound page using default language content
  { path: 'not-found', component: NotFoundComponent },

  { path: '', redirectTo: 'en', pathMatch: 'full' },
  { path: ':lang', component: NavComponent,
    
    // Uses the content manager resolver to pre-fetch language data
    // to be used by the children pages
    resolve: { lang: ContentResolver },

    children: [
    
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      { path: 'home', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'signout', component: LoginComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'apply', component: ApplyComponent },
      { path: 'projects', component: BrowserComponent },
      { path: 'projects/:id', component: ProjectComponent },
    
      // NotFound page with localized translation loaded
      { path: 'not-found', component: NotFoundComponent },
      
      { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
    ]
  },

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
