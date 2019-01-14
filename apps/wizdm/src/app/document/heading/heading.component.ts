import { Component, Input } from '@angular/core';
import { wmHeading, EditableContent } from '../common/editable-content';

@Component({
  selector: 'wm-heading',
  templateUrl: './heading.component.html'
})
export class HeadingComponent {

  @Input('wm-heading') heading: EditableContent<wmHeading>;
}