import { Component, Input, HostBinding } from '@angular/core';
import { EditableBlock } from '../model';

@Component({
  selector: '[wm-block]',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent {

  @Input('wm-block') block: EditableBlock;

  @HostBinding('id') get id() {
    return !!this.block && this.block.id;
  }
}