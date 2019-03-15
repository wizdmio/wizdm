import { Component, Input, HostBinding } from '@angular/core';
import { EditableList } from '../model';
import { EditableSelection } from '../selection/editable-selection.service';

@Component({
  selector: '[wm-list]',
  templateUrl: './list.component.html'
})
export class ListComponent {

  constructor(private sel: EditableSelection) {}
  
  @Input('wm-list') list: EditableList;
   // Applies the node id to the element
  @HostBinding('id') get id() { return !!this.list && this.list.id; }
  // Applies the list start attribute when applicable
  @HostBinding('attr.start') get start() { return !!this.list && this.list.data.start; }
  // Applies the 'selected' attribute for selection styling
  @HostBinding('attr.selected') get selected() { return this.sel.selected(this.list) ? '' : undefined; }
}