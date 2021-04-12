import { Component, Input, HostBinding } from '@angular/core';
import { EditableList } from '../model/editable-list';
import { DocumentViewer } from '../editable-viewer.component';

/** Inline Elements' custom classes */
export interface EditableListCustomClasses {  
  ol?: string;
  ul?: string; 
  li?: string;
}

/** List Node Renderer */
@Component({
  selector: '[wm-list]',
  templateUrl: './list.component.html'
})
export class ListComponent {

  constructor(readonly document: DocumentViewer) {}
  
  /** Input Node */
  @Input('wm-list') list: EditableList;

  /** Rendered elements' custom classes */
  @Input() customClasses: EditableListCustomClasses;

   // Applies the node id to the element
  @HostBinding('id') get id() { 
    return !!this.list && this.list.id; 
  }

  // Applies the list start attribute when applicable
  @HostBinding('attr.start') get start() { 
    return !!this.list && this.list.start; 
  }

  // Applies the 'selected' attribute for selection styling
  @HostBinding('attr.selected') get selected() { 
    return this.document.isSelected(this.list) ? '' : undefined; 
  }
}