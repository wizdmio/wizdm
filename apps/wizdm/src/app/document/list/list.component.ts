import { Component, Input, HostBinding } from '@angular/core';
import { EditableList } from '../model';

@Component({
  selector: '[wm-list]',
  templateUrl: './list.component.html'
})
export class ListComponent {
  
  @Input('wm-list') list: EditableList;

  @HostBinding('id') get id() {
    return !!this.list && this.list.id;
  }

  @HostBinding('attr.start') get start() {
    return !!this.list && this.list.data.start;
  }
}