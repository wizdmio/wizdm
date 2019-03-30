import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EditableDocument } from './editable-document.component';
import { EditableComponent } from './editable/editable.component';
import { ListComponent } from './list/list.component';
import { BlockComponent } from './block/block.component';
import { TableComponent } from './table/table.component';
import { ImageComponent } from './image/image.component';
import { EditableToc } from './toc/editable-toc.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    EditableDocument, 
    EditableComponent,
    ListComponent, 
    BlockComponent,
    TableComponent, 
    ImageComponent, 
    EditableToc
  ],
  exports: [
    EditableDocument,
    EditableToc
  ]
})
export class EditableModule {}
