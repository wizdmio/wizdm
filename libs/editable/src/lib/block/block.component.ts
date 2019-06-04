import { Component, Input, HostBinding } from '@angular/core';
import { EditableDocument } from '../editable-document.component';
import { EditableBlock } from '../model/editable-text';

@Component({
  selector: '[wm-block]',
  templateUrl: './block.component.html'
})
export class BlockComponent {

  constructor(private document: EditableDocument) {}

  @Input('wm-block') block: EditableBlock;
  // Applies the node id to the element
  @HostBinding('id') get id() { return !!this.block && this.block.id;}
  // Applies the 'selected' attribute for selection styling
  @HostBinding('attr.selected') get selected() { 
    return this.document.selection.includes(this.block) ? '' : undefined; 
  }
}