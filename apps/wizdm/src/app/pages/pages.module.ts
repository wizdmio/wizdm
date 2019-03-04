import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
// Angular material + Flex layout
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatIconModule,
  MatMenuModule,
  MatBadgeModule,
  MatFormFieldModule,
  MatInputModule,
  MatStepperModule,
  MatExpansionModule,
  MatListModule,
  MatCheckboxModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatToolbarModule,
  MatSelectModule,
  //MatDividerModule,
  //MatTooltipModule,
  MatDatepickerModule,
  DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE
} from '@angular/material';

import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

//--------
import { MarkdownModule } from '@wizdm/markdown';
//--------
import { ElementsModule } from '../elements/elements.module';
import { DocumentModule } from '../document/editable-document.module';
//--------
import { HandlerComponent } from './handler/handler.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { UserItemComponent } from './user/user-item/user-item.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserInfoDirective } from './user-info/user-info.directive';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExploreComponent } from './explore/explore.component';
import { ExploreItemComponent } from './explore/item/item.component';
import { ApplyComponent } from './apply/apply.component';
import { EditorComponent } from './editor/editor.component';
import { UploadComponent } from './upload/upload.component';
import { UploadsComponent } from './uploads/uploads.component';
import { MessagesComponent } from './messages/messages.component';
import { MessageComponent } from './messages/message/message.component';
import { TermsPrivacyComponent } from './terms-privacy/terms-privacy.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatButtonModule,
    //MatButtonToggleModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatStepperModule,
    MatListModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatToolbarModule,
    //MatTooltipModule,
    MatDatepickerModule,
    MarkdownModule,
    ElementsModule,
    DocumentModule
  ],

  declarations: [
    HandlerComponent,
    HomeComponent,
    AboutComponent,
    LoginComponent,
    UserComponent,
    UserItemComponent,
    UserInfoComponent,
    UserInfoDirective,
    DashboardComponent,
    ExploreComponent,
    ExploreItemComponent,
    ApplyComponent,
    EditorComponent,
    UploadComponent,
    UploadsComponent,
    MessagesComponent,
    MessageComponent,
    TermsPrivacyComponent,
    NotFoundComponent
  ],

  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [ MAT_DATE_LOCALE ]},
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ],

  entryComponents: []

})
export class PagesModule { }
