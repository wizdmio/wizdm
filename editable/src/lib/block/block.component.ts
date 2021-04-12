import { Component, Input, HostBinding } from '@angular/core';
import { DocumentViewer } from '../editable-viewer.component';
import { EditableBlock } from '../model/editable-block';

/** Block Elements' custom classes */
export interface EditableBlockCustomClasses {

  h1?: string;
  h2?: string;
  h3?: string;
  h4?: string;
  h5?: string;
  h6?: string;
  p? : string;
  ol?: string;
  ul?: string;
}

@Component({
  selector: 'blockquote[wm-block]',
  templateUrl: './block.component.html'
})
export class BlockComponent {

  constructor(private document: DocumentViewer) {}

  /** Block Node */
  @Input('wm-block') block: EditableBlock;

  /** Rendered elements' custom classes */
  @Input() customClasses: EditableBlockCustomClasses;

  // Applies the node id to the element
  @HostBinding('id') get id() { 
    return !!this.block && this.block.id; 
  }
  
  // Applies the 'selected' attribute for selection styling
  @HostBinding('attr.selected') get selected() { 
    return this.document.isSelected(this.block) ? '' : undefined; 
  }
}