import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocumentComponent } from './editable-document.component';
import { EditableComponent } from './editable/editable.component';
import { ListComponent } from './list/list.component';
import { BlockComponent } from './block/block.component';
import { TableComponent } from './table/table.component';
import { FigureComponent } from './figure/figure.component';
import { EditableFactoryService } from './factory/editable-factory.service';
import { EditableFactory } from './model/editable-factory';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    DocumentComponent, 
    EditableComponent,
    ListComponent, 
    BlockComponent,
    TableComponent,
    FigureComponent
  ],
  exports: [
    DocumentComponent
  ],
  providers: [ EditableFactoryService ]
})
export class EditableModule {}
