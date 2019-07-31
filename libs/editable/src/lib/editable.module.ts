import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EditableDocument } from './editable-document.component';
import { EditableComponent } from './editable/editable.component';
import { ListComponent } from './list/list.component';
import { BlockComponent } from './block/block.component';
import { TableComponent } from './table/table.component';
import { FigureComponent } from './figure/figure.component';

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
    FigureComponent
  ],
  exports: [
    EditableDocument
  ]
})
export class EditableModule {}
