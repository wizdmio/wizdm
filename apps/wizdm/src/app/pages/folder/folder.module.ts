import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
import { FileOpenModule } from '../../elements/openfile';
import { PopupModule } from '../../elements/popup';
import { AuthGuard, PageGuard } from '../../utils';
import { FolderComponent } from './folder.component';

const routes: RoutesWithContent = [
  {
    path: '',
    component: FolderComponent,
    content: 'folder',
    canActivate: [ AuthGuard ],
    canDeactivate: [ PageGuard ]
  }
];

@NgModule({
  declarations: [ FolderComponent ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDividerModule,
    MatListModule,
    MatProgressBarModule,
    FileOpenModule,
    PopupModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class FolderModule { }
