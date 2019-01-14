import { Component, Input } from '@angular/core';
import { wmList, EditableContent } from '../common/editable-content';

@Component({
  selector: 'wm-list',
  templateUrl: './list.component.html'
})
export class ListComponent {

  constructor() { }

  list: EditableContent<wmList>;

  @Input('wm-list') set source(list: EditableContent<wmList>) {
    // Updates the node deferring descendants
    this.list = list.update(true);
  }
}