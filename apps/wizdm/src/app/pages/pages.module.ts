import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
//--------
import { MarkdownModule } from '@wizdm/markdown';
//--------
import { ElementsModule } from '../elements/elements.module';
import { HandlerComponent } from './handler/handler.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { UserItemComponent } from './user/user-item/user-item.component';
import { ApplyComponent } from './apply/apply.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectComponent } from './project/project.component';
import { HeaderComponent as ProjectHeader } from './project/header/header.component';
import { CrystalEditComponent as ProjectEditor } from './project/crystal-edit/crystal-edit.component';
import { ExploreComponent } from './explore/explore.component';
import { ExploreItemComponent } from './explore/item/item.component';
import { UploadComponent } from './upload/upload.component';
import { MessagesComponent } from './messages/messages.component';
import { MessageComponent } from './messages/message/message.component';
import { TermsPrivacyComponent } from './terms-privacy/terms-privacy.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { UploadsComponent } from './uploads/uploads.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserInfoDirective } from './user-info/user-info.directive';



@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ElementsModule,
    MarkdownModule
  ],

  declarations: [
    HandlerComponent,
    AboutComponent,
    LoginComponent,
    UserComponent,
    UserItemComponent,
    UserInfoComponent,
    UserInfoDirective,
    ApplyComponent,
    ExploreComponent,
    ExploreItemComponent,
    DashboardComponent,
    ProjectComponent,
    ProjectHeader,
    ProjectEditor,
    UploadComponent,
    UploadsComponent,
    MessagesComponent,
    MessageComponent,
    TermsPrivacyComponent,
    NotFoundComponent
  ],

  providers: [],

  entryComponents: []

})
export class PagesModule { }
