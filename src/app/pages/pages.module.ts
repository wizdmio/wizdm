import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

//--------
import { SharedModule } from '../shared/shared.module';
import { HandlerComponent } from './handler/handler.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { TermsPrivacyComponent } from './terms-privacy/terms-privacy.component';
import { TermsPrivacyPopupComponent } from './terms-privacy/terms-privacy-popup.component';
import { LoginComponent } from './login/login.component';
//import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfileItemComponent } from './user-profile/user-profile-item/user-profile-item.component';
//import { ProjectListComponent } from './dashboard/project-list/project-list.component';
//import { ProjectTileComponent } from './dashboard/project-list/project-tile/project-tile.component';
import { ApplyComponent } from './apply/apply.component';
import { BrowserComponent } from './browser/browser.component';
import { ProjectComponent } from './project/project.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule
  ],

  declarations: [
    HandlerComponent,
    HomeComponent,
    AboutComponent,
    TermsPrivacyComponent,
    TermsPrivacyPopupComponent,
    LoginComponent,
    //DashboardComponent,
    UserProfileComponent,
    UserProfileItemComponent,
    //ProjectListComponent,
    //ProjectTileComponent,
    ApplyComponent,
    BrowserComponent,
    ProjectComponent,
    NotFoundComponent
  ],

  providers: [
  ],

  entryComponents: [
    TermsPrivacyPopupComponent // This component is declared here to propoerly work as a Dialog
  ]

})
export class PagesModule { }
