import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';

import {
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatStepperModule
} from '@angular/material';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { TermsPrivacyComponent } from './terms-privacy/terms-privacy.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApplyComponent } from './apply/apply.component';
import { BrowserComponent } from './browser/browser.component';
import { ProjectComponent } from './project/project.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FlexLayoutModule,

    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule
  ],
  declarations: [
    HomeComponent,
    AboutComponent,
    TermsPrivacyComponent,
    LoginComponent,
    DashboardComponent,
    ApplyComponent,
    BrowserComponent,
    ProjectComponent,
    NotFoundComponent
  ]
})
export class PagesModule { }
