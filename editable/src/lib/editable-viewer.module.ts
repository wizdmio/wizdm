import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableComponent } from './editable/editable.component';
import { ListComponent } from './list/list.component';
import { BlockComponent } from './block/block.component';
import { TableComponent } from './table/table.component';
import { FigureComponent } from './figure/figure.component';
import { DocumentViewer } from './editable-viewer.component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [
    DocumentViewer, 
    EditableComponent,
    ListComponent, 
    BlockComponent,
    TableComponent,
    FigureComponent
  ],
  exports: [ 
    DocumentViewer,
    EditableComponent,
    ListComponent, 
    BlockComponent,
    TableComponent,
    FigureComponent 
  ]
})
export class EditableViewerModule {}
