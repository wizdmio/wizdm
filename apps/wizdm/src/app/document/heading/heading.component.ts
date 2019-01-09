import { Component, Input } from '@angular/core';
import { wmHeading, EditableContent } from '../editable/editable-content';

@Component({
  selector: 'wm-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss']
})
export class HeadingComponent extends EditableContent {

  //constructor() { super(); }

  @Input('wm-heading') heading: wmHeading;
}