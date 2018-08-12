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
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfileItemComponent } from './user-profile/user-profile-item/user-profile-item.component';
import { ApplyComponent } from './apply/apply.component';
import { ProjectComponent } from './project/project.component';
import { ProjectBrowserComponent } from './project-browser/project-browser.component';
import { ProjectBrowserItemComponent } from './project-browser/project-browser-item/project-browser-item.component';
import { PeopleBrowserComponent } from './people-browser/people-browser.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { EditBoxComponent } from './project/edit-box/edit-box.component';

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
    UserProfileComponent,
    UserProfileItemComponent,
    ApplyComponent,
    ProjectBrowserComponent,
    ProjectBrowserItemComponent,
    ProjectComponent,
    PeopleBrowserComponent,
    NotFoundComponent,
    EditBoxComponent
  ],

  providers: [
  ],

  entryComponents: [
    TermsPrivacyPopupComponent // This component is declared here to propoerly work as a Dialog
  ]

})
export class PagesModule { }
