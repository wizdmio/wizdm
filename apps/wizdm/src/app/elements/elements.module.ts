import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// Angular material + Flex layout
import { FlexLayoutModule } from '@angular/flex-layout';

import {
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatBadgeModule,
  MatFormFieldModule,
  MatInputModule,
  MatStepperModule,
  MatExpansionModule,
  MatListModule,
  MatGridListModule,
  MatCheckboxModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatToolbarModule,
  MatSidenavModule,
  MatSelectModule,
  MatDividerModule,
  MatTabsModule,
  MatTooltipModule,
  MatDatepickerModule,
  DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE
} from '@angular/material';

import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

// Application specific
import { IconComponent } from './icon/icon.component';
import { TogglerComponent } from './toggler/toggler.component';
import { InkbarComponent } from './inkbar/inkbar.component';
import { AvatarComponent } from './avatar/avatar.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { PopupComponent } from './popup/popup.component';
import { OpenFileComponent } from './file/open-file.component';
import { DropZoneDirective } from './file/drop-zone.directive';
import { FileSizePipe } from './file/file-size.pipe';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { ColorsDirective } from './colors/colors.directive';
import { LikesComponent } from './likes/likes.component';
import { RouterInkbarComponent } from './router-inkbar/router-inkbar.component';
import { RouterInkbarDirective } from './router-inkbar/router-inkbar.directive';

const sharedModules = [
  FlexLayoutModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatBadgeModule,
  MatFormFieldModule,
  MatInputModule,
  MatStepperModule,
  MatExpansionModule,
  MatListModule,
  MatGridListModule,
  MatCheckboxModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatToolbarModule,
  //MatSidenavModule,
  MatSelectModule,
  MatDividerModule,
  //MatTabsModule,
  //MatTooltipModule,
  MatDatepickerModule
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ...sharedModules
  ],
  
  declarations: [
    IconComponent,
    TogglerComponent,
    InkbarComponent,
    AvatarComponent,
    DisclaimerComponent,
    PopupComponent,
    OpenFileComponent,
    DropZoneDirective,
    FileSizePipe,
    ColorPickerComponent,
    ColorsDirective,
    LikesComponent,
    RouterInkbarComponent,
    RouterInkbarDirective
  ],

  exports: [
    ...sharedModules,
//------------------------    
    IconComponent,
    TogglerComponent,
    InkbarComponent,
    AvatarComponent,
    DisclaimerComponent,
    PopupComponent,
    OpenFileComponent,
    DropZoneDirective,
    FileSizePipe,
    ColorPickerComponent,
    ColorsDirective,
    LikesComponent,
    RouterInkbarComponent,
    RouterInkbarDirective
  ],

  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [ MAT_DATE_LOCALE ]},
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ],

  entryComponents: [// Don't forget to declare dialogs here
    PopupComponent
  ]
})
export class ElementsModule { }
