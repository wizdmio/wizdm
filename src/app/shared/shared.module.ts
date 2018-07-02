import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatDialogModule,
  MatToolbarModule,
  MatSidenavModule,
  MatSelectModule,
  MatDividerModule
} from '@angular/material';

import { IconComponent } from './icon/icon.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { PopupComponent } from './popup/popup.component';
import { PopupService } from './popup/popup.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
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
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSelectModule,
    MatDividerModule
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
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSelectModule,
    MatDividerModule,
//------------------------    
    IconComponent,
    DisclaimerComponent,
    PopupComponent
  ],

  providers: [
    PopupService
  ],

  entryComponents: [
    PopupComponent // Don't forget to declare dialogs here
  ]
})
export class SharedModule { }
