import { Component, Input, HostBinding } from '@angular/core';
import { EditableContent } from '../common/editable-content';
import { wmBlock } from '../common/editable-types';

@Component({
  selector: '[wm-block]',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent {

  @Input('wm-block') block: EditableContent<wmBlock>;

  @HostBinding('id') get id() {
    return !!this.block && this.block.id;
  }
}