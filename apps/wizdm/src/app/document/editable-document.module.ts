import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular material + Flex layout
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatIconModule,
  MatMenuModule,
  MatDividerModule
} from '@angular/material';

import { EditableDocument } from './editable-document.component';
import { EditableComponent } from './editable/editable.component';
import { ListComponent } from './list/list.component';
import { BlockComponent } from './block/block.component';
import { TableComponent } from './table/table.component';
import { ImageComponent } from './image/image.component';
import { EditableToc } from './toc/editable-toc.component';
import { EditableMenu } from './menu/editable-menu.component';
import { EditableToolbar } from './toolbar/editable-toolbar.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  declarations: [
    EditableDocument, 
    EditableComponent,
    ListComponent, 
    BlockComponent,
    TableComponent, 
    ImageComponent, 
    EditableToc,
    EditableMenu, 
    EditableToolbar
  ],
  exports: [
    EditableDocument,
    EditableToc,
    EditableMenu,
    EditableToolbar
  ]
})
export class DocumentModule { }
