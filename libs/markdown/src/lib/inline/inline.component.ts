import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: '[wm-inline]',
  templateUrl: './inline.component.html',
  styleUrls: ['./inline.component.scss']
})
export class InlineComponent {

  constructor() {}

  @Input('wm-inline') node: any;
}