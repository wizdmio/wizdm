import { Component, Input, HostBinding } from '@angular/core';
import { EditableTable } from '../model';
import { EditableSelection } from '../selection/editable-selection.service';

@Component({
  selector: 'table[wm-table]',
  templateUrl: './table.component.html'
})
export class TableComponent {

  constructor(private sel: EditableSelection) {}

  @Input('wm-table') table: EditableTable;
  // Applies the node id to the element
  @HostBinding('id') get id() { return !!this.table && this.table.id; }
  // Applies table margins according to node alignement
  @HostBinding('style.margin-left') get mleft() { 
    return !!this.table && !!this.table.align && this.table.align !== 'left' ? 'auto' : null; 
  }
  @HostBinding('style.margin-right') get mright() { 
    return !!this.table && !!this.table.align && this.table.align !== 'right' ? 'auto' : null; 
  }
  // Applies the 'selected' attribute for selection styling
  @HostBinding('attr.selected') get selected() { return this.sel.selected(this.table) ? '' : undefined; }
}