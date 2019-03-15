import { Component, Input, HostBinding } from '@angular/core';
import { EditableBlock } from '../model';
import { EditableSelection } from '../selection/editable-selection.service';

@Component({
  selector: '[wm-block]',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent {

  constructor(private sel: EditableSelection) {}

  @Input('wm-block') block: EditableBlock;
  // Applies the node id to the element
  @HostBinding('id') get id() { return !!this.block && this.block.id;}
  // Applies the 'selected' attribute for selection styling
  @HostBinding('attr.selected') get selected() { return this.sel.selected(this.block) ? '' : undefined; }
}