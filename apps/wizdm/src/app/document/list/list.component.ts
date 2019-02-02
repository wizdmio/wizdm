import { Component, Input, HostBinding } from '@angular/core';
import { EditableContent } from '../common/editable-content';
import { wmList } from '../common/editable-types';

@Component({
  selector: '[wm-list]',
  templateUrl: './list.component.html'
})
export class ListComponent {
  
  @Input('wm-list') list: EditableContent<wmList>;

  @HostBinding('id') get id() {
    return !!this.list && this.list.id;
  }

  @HostBinding('attr.start') get start() {
    return !!this.list && this.list.data.start;
  }
}