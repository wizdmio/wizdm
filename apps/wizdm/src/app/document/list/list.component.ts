import { Component, Input } from '@angular/core';
import { wmList, EditableContent } from '../editable/editable-content';

@Component({
  selector: 'wm-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends EditableContent {

  //constructor() { super(); }

  @Input('wm-list') list: wmList;
}