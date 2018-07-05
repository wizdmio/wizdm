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
  MatDividerModule
} from '@angular/material';

import { IconComponent } from './icon/icon.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { ListItemComponent } from './list-item/list-item.component';
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
    MatDividerModule
  ],
  
  declarations: [
    IconComponent,
    DisclaimerComponent,
    ListItemComponent,
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
//------------------------    
    IconComponent,
    DisclaimerComponent,
    ListItemComponent,
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
