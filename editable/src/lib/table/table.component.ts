import { Component, Input, HostBinding } from '@angular/core';
import { EditableTable } from '../model/editable-table';
import { DocumentViewer } from '../editable-viewer.component';

/** Inline Elements' custom classes */
export interface EditableTableCustomClasses {  
  tr?: string;
  td?: string; 
}

/** Table Node Renderer */
@Component({
  selector: 'table[wm-table]',
  templateUrl: './table.component.html'
})
export class TableComponent {

  constructor(readonly document: DocumentViewer) {}

  /** Input Node */
  @Input('wm-table') table: EditableTable;

  /** Rendered elements' custom classes */
  @Input() customClasses: EditableTableCustomClasses;

  // Applies the node id to the element
  @HostBinding('id') get id() { 
    return !!this.table && this.table.id; 
  }

  // Applies table margins according to node alignement
  @HostBinding('style.margin-left') get mleft() { 
    return !!this.table && this.table.align !== 'left' ? 'auto' : null; 
  }
  @HostBinding('style.margin-right') get mright() { 
    return !!this.table && this.table.align !== 'right' ? 'auto' : null; 
  }
  // Applies the 'selected' attribute for selection styling
  @HostBinding('attr.selected') get selected() { 
    return this.document.isSelected(this.table) ? '' : undefined; 
  } 
}