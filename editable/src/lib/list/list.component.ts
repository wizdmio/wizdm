import { Component, Input, HostBinding } from '@angular/core';
import { DocumentComponent } from '../editable-document.component';
import { EditableList } from '../model/editable-list';

@Component({
  selector: '[wm-list]',
  templateUrl: './list.component.html'
})
export class ListComponent {

  constructor(readonly document: DocumentComponent) {}
  
  @Input('wm-list') list: EditableList;
   // Applies the node id to the element
  @HostBinding('id') get id() { return !!this.list && this.list.id; }
  // Applies the list start attribute when applicable
  @HostBinding('attr.start') get start() { return !!this.list && this.list.start; }
  // Applies the 'selected' attribute for selection styling
  @HostBinding('attr.selected') get selected() { 
    return this.document.selection.includes(this.list) ? '' : undefined; 
  }
}