import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableViewerModule } from '@wizdm/editable';
import { DocumentComponent } from './editable-document.component';

@NgModule({
  imports: [ CommonModule, EditableViewerModule ],
  declarations: [ DocumentComponent ],
  exports: [ DocumentComponent, EditableViewerModule ]
})
export class EditableDocumentModule {}
