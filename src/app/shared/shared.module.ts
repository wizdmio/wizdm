import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatStepperModule,
  MatExpansionModule,
  MatListModule,
  MatGridListModule,
  MatCheckboxModule,
  MatProgressBarModule,
  MatDialogModule,
  MatToolbarModule,
  MatSidenavModule,
  MatSelectModule,
  MatDividerModule,
  MatTabsModule,
  MatDatepickerModule,
  DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE
} from '@angular/material';

import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

import { IconComponent } from './icon/icon.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { PopupComponent } from './popup/popup.component';
import { PopupService } from './popup/popup.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatExpansionModule,
    MatListModule,
    MatGridListModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatDialogModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSelectModule,
    MatDividerModule,
    MatTabsModule,
    MatDatepickerModule
  ],
  
  declarations: [
    IconComponent,
    DisclaimerComponent,
    PopupComponent
  ],

  exports: [
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatExpansionModule,
    MatListModule,
    MatGridListModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatDialogModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSelectModule,
    MatDividerModule,
    MatTabsModule,
    MatDatepickerModule,
//------------------------    
    IconComponent,
    DisclaimerComponent,
    PopupComponent
  ],

  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [ MAT_DATE_LOCALE ]},
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    PopupService
  ],

  entryComponents: [
    PopupComponent // Don't forget to declare dialogs here
  ]
})
export class SharedModule { }
