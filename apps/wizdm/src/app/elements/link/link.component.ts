import { Component, Input, HostBinding, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material/core'

@Component({
  selector: 'wm-link, [wm-link]',
  template: '<ng-content></ng-content>',
  styleUrls: ['./link.component.scss'],
  host: { 'class': 'wm-link' },
  encapsulation: ViewEncapsulation.None
})
export class LinkComponent  {

  @HostBinding('attr.color')
  @Input() color: ThemePalette = 'primary';

  @HostBinding('attr.disabled')
  @Input() disabled: boolean;s
}
