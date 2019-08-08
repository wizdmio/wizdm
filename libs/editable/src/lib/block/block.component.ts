import { Component, Input, HostBinding } from '@angular/core';
import { DocumentComponent } from '../editable-document.component';
import { EditableBlock } from '../model/editable-block';

@Component({
  selector: 'blockquote[wm-block]',
  templateUrl: './block.component.html'
})
export class BlockComponent {

  constructor(private document: DocumentComponent) {}

  @Input('wm-block') block: EditableBlock;
  // Applies the node id to the element
  @HostBinding('id') get id() { return !!this.block && this.block.id;}
  // Applies the 'selected' attribute for selection styling
  @HostBinding('attr.selected') get selected() { 
    return this.document.selection.includes(this.block) ? '' : undefined; 
  }
}