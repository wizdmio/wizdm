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
import { AvatarComponent } from './avatar/avatar.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { PopupComponent } from './popup/popup.component';
import { MarkdownComponent } from './markdown/markdown.component';
import { CodeHighlightComponent } from './markdown/code-highlight/code-highlight.component';
import { OpenFileComponent } from './file/open-file.component';
import { DropZoneDirective } from './file/drop-zone.directive';
import { FileSizePipe } from './file/file-size.pipe';
import { UploadsComponent } from '../shared/uploads/uploads.component';
import { ErrorsComponent } from './errors/errors.component';
import { ColorsComponent } from './colors/colors.component';
import { ColorsDirective } from './colors/colors.directive';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserInfoDirective } from './user-info/user-info.directive';
import { LikesComponent } from './likes/likes.component';
import { FilterComponent } from './filter/filter.component';
import { InkbarComponent } from './filter/inkbar/inkbar.component';

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
  MatSidenavModule,
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
    AvatarComponent,
    DisclaimerComponent,
    PopupComponent,
    MarkdownComponent,
    CodeHighlightComponent,
    OpenFileComponent,
    DropZoneDirective,
    FileSizePipe,
    UploadsComponent,
    ErrorsComponent,
    ColorsComponent,
    ColorsDirective,
    UserInfoComponent,
    UserInfoDirective,
    LikesComponent,
    FilterComponent,
    InkbarComponent
  ],

  exports: [
    ...sharedModules,
//------------------------    
    IconComponent,
    AvatarComponent,
    DisclaimerComponent,
    PopupComponent,
    MarkdownComponent,
    OpenFileComponent,
    DropZoneDirective,
    FileSizePipe,
    UploadsComponent,
    ErrorsComponent,
    ColorsComponent,
    ColorsDirective,
    UserInfoComponent,
    UserInfoDirective,
    LikesComponent,
    FilterComponent,
    InkbarComponent
  ],

  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [ MAT_DATE_LOCALE ]},
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ],

  entryComponents: [// Don't forget to declare dialogs here
    PopupComponent,
    UserInfoComponent
  ]
})
export class SharedModule { }
