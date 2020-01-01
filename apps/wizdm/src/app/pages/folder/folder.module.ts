import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
//import { MatDividerModule } from '@angular/material/divider';
//import { MatListModule } from '@angular/material/list';
//import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { OpenFileModule } from '@wizdm/elements/openfile';
import { DialogModule } from '@wizdm/elements/dialog';
import { ReadmeModule } from '@wizdm/elements/readme';
import { ThumbnailModule } from '@wizdm/elements/thumbnail';
import { SpinnerModule } from '@wizdm/elements/spinner';
import { ActionbarModule } from 'app/navigator/actionbar';
import { AuthGuard } from 'app/utils/auth-guard';
//import { CanLeaveGuard } from 'app/utils/can-leave';
import { FolderComponent } from './folder.component';

const routes: RoutesWithContent = [
  {
    path: '',
    content: 'folder',
    component: FolderComponent,
    canActivate: [ AuthGuard ],
    //canDeactivate: [ CanLeaveGuard ]
  }
];

@NgModule({
  declarations: [ FolderComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    OpenFileModule,
    DialogModule,
    ReadmeModule,
    ThumbnailModule,
    SpinnerModule,
    ActionbarModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class FolderModule { }
