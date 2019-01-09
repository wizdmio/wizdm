import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ContentComponent } from './editable/content.component';
import { EditableComponent } from './editable/editable.component';
import { HeadingComponent } from './heading/heading.component';
import { ListComponent } from './list/list.component';
import { TableComponent } from './table/table.component';
import { ImageComponent } from './image/image.component';
import { DocumentComponent } from './document.component';
import { DocumentTocComponent } from './toc/toc.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    ContentComponent,
    EditableComponent, 
    HeadingComponent, 
    ListComponent, 
    TableComponent, 
    ImageComponent, 
    DocumentComponent, 
    DocumentTocComponent
  ],
  exports: [
    DocumentComponent,
    DocumentTocComponent
  ]
})
export class DocumentModule { }
