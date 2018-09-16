import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from '@wizdm/markdown';
//--------
import { SharedModule } from '../shared/shared.module';
import { HandlerComponent } from './handler/handler.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { TermsPrivacyComponent } from './terms-privacy/terms-privacy.component';
import { TermsPrivacyPopupComponent } from './terms-privacy/terms-privacy-popup.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { UserItemComponent } from './user/user-item/user-item.component';
import { ApplyComponent } from './apply/apply.component';
import { ProjectComponent } from './project/project.component';
import { HeaderComponent as ProjectHeader } from './project/header/header.component';
import { CrystalEditComponent as ProjectEditor } from './project/crystal-edit/crystal-edit.component';
import { BrowserComponent } from './browser/browser.component';
import { CardComponent } from './browser/card/card.component';
//import { ProjectBrowserItemComponent } from './browser/project-browser-item/project-browser-item.component';
import { UploadComponent } from './upload/upload.component';
import { ConversationsComponent } from './conversations/conversations.component';
import { ConversationComponent } from './conversations/conversation/conversation.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
    MarkdownModule
  ],

  declarations: [
    HandlerComponent,
    HomeComponent,
    AboutComponent,
    TermsPrivacyComponent,
    TermsPrivacyPopupComponent,
    LoginComponent,
    UserComponent,
    UserItemComponent,
    ApplyComponent,
    BrowserComponent,
    CardComponent,
    ProjectComponent,
    ProjectHeader,
    ProjectEditor,
    UploadComponent,
    ConversationsComponent,
    ConversationComponent,
    NotFoundComponent
  ],

  providers: [],

  entryComponents: [// These components are declared here to properly work as a Dialogs
    TermsPrivacyPopupComponent
  ]

})
export class PagesModule { }
