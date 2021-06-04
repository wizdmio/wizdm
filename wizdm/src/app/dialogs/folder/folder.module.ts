import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
//import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContentRouterModule, RoutesWithContent } from '@wizdm/content';
//import { ThumbnailModule } from '@wizdm/elements/thumbnail';
import { ImageModule } from '@wizdm/elements/image';
import { SpinnerModule } from '@wizdm/elements/spinner';
//import { DialogModule } from '@wizdm/elements/dialog';
import { FileDialogModule } from '@wizdm/file-dialog';
import { IconModule } from '@wizdm/elements/icon';
//import { ReadmeModule } from '@wizdm/readme';
import { LazyImageModule } from '@wizdm/lazy-image';
import { FolderComponent } from './folder.component';

/** Dialog route. This route will be used by the LazyDialogLoader, emulating the router, to lazily load the dialog */
const routes: RoutesWithContent = [{
  path: '',
  content: 'folder',
  component: FolderComponent,
  data: { dialogConfig: { 
    minWidth: 'calc(100vw - 48px)', 
    height: 'calc(100vh - 48px)',
    maxHeight: 'calc(100vh - 48px)'
  }}
}];

@NgModule({
  declarations: [ FolderComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatDialogModule,
    MatButtonModule,
    //MatGridListModule,
    MatButtonToggleModule,    
    MatProgressSpinnerModule,
    //ReadmeModule,
    //DialogModule,
    IconModule,
    //ThumbnailModule,
    ImageModule,
    SpinnerModule,
    LazyImageModule,
    FileDialogModule,
    ContentRouterModule.forChild(routes)
  ]
})
export class FolderModule { }
