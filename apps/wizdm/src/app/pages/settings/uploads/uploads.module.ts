import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GtagModule } from '@wizdm/gtag';
import { DialogModule } from '@wizdm/dialog';
import { ReadmeModule } from '@wizdm/readme';
import { IconModule } from '@wizdm/elements/icon';
import { ImageModule } from '@wizdm/elements/image';
import { ButtonChangerModule } from '@wizdm/elements/button';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { MomentPipesModule } from '@wizdm/pipes/moment';
import { FileSizePipeModule } from '@wizdm/pipes/file-size';
//import { CanLeaveModule, CanLeaveGuard } from 'app/pages/guards/can-leave';
import { DownloadModule } from 'app/utils/download';
import { ActionbarModule } from 'app/navigator/actionbar';
import { UploadsComponent } from './uploads.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'uploads',
    component: UploadsComponent,
    //canDeactivate: [ CanLeaveGuard ]
  }
];

@NgModule({
  declarations: [ UploadsComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatTableModule,
    MatSortModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    GtagModule,
    DialogModule,
    ReadmeModule,
    IconModule,
    ImageModule,
    ButtonChangerModule,
    //CanLeaveModule,
    ActionbarModule,
    FileSizePipeModule,
    MomentPipesModule,
    DownloadModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class UploadsModule { }
