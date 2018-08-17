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
import { HeaderComponent as ProjectHeader } from './project/header/header.component';
import { MessageComponent as ProjectMessage } from './project/message/message.component';
import { CrystalEditComponent as ProjectEditor } from './project/crystal-edit/crystal-edit.component';
import { ProjectBrowserComponent } from './project-browser/project-browser.component';
import { ProjectBrowserItemComponent } from './project-browser/project-browser-item/project-browser-item.component';
import { PeopleBrowserComponent } from './people-browser/people-browser.component';
import { UploadComponent } from './upload/upload.component';
import { UploadsComponent } from './upload/uploads.component';
import { UploadsService } from './upload/uploads.service';
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
    UserProfileComponent,
    UserProfileItemComponent,
    ApplyComponent,
    ProjectBrowserComponent,
    ProjectBrowserItemComponent,
    ProjectComponent,
    ProjectHeader,
    ProjectMessage,
    ProjectEditor,
    PeopleBrowserComponent,
    UploadComponent,
    UploadsComponent,
    NotFoundComponent
  ],

  providers: [
    UploadsService
  ],

  entryComponents: [// These components are declared here to properly work as a Dialogs
    UploadsComponent,
    TermsPrivacyPopupComponent
  ]

})
export class PagesModule { }
