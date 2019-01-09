import { Component, Input, HostBinding } from '@angular/core';
import { wmEditable, EditableContent } from './editable-content';

@Component({
  selector: '[wm-content]',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent extends EditableContent {

  //constructor() { super(); }
/*
  @HostBinding('id') get id() {
    return this.root && this.root.id;
  }
*/
  @Input('wm-content') root: wmEditable;
}
