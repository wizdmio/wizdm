import { Component, Input, HostBinding } from '@angular/core';
import { EditableDocument } from '../editable-document.component';
import { EditableTable } from '../model/editable-table';

@Component({
  selector: 'div[wm-table]',
  templateUrl: './table.component.html',
  host: { 
    'contenteditable': 'false',
    'style': 'user-select: none'
  }
})
export class TableComponent {

  constructor(readonly document: EditableDocument) {}

  @Input('wm-table') table: EditableTable;

  // Applies the node id to the element
  @HostBinding('id') get id() { return !!this.table && this.table.id; }

  get mleft() { return !!this.table && this.table.align !== 'left' ? 'auto' : null; }
  get mright() { return !!this.table && this.table.align !== 'right' ? 'auto' : null; }
  get selected() { return this.document.selection.includes(this.table) ? '' : undefined; }
/*
  // Applies table margins according to node alignement
  @HostBinding('style.margin-left') get mleft() { 
    return !!this.table && this.table.align !== 'left' ? 'auto' : null; 
  }
  @HostBinding('style.margin-right') get mright() { 
    return !!this.table && this.table.align !== 'right' ? 'auto' : null; 
  }
  // Applies the 'selected' attribute for selection styling
  @HostBinding('attr.selected') get selected() { 
    return this.document.selection.includes(this.table) ? '' : undefined; 
  }
  */
}