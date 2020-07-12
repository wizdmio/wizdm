import { Component, Input, HostBinding, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material/core'

@Component({
  selector: 'wm-balloon',
  template: '<ng-content></ng-content>',
  styleUrls: ['./balloon.component.scss'],
  host: { 'class': 'wm-balloon' },
  encapsulation: ViewEncapsulation.None
})
export class BalloonComponent  {

  @HostBinding('attr.side')
  @Input() side: 'left'|'top'|'right'|'bottom' = 'bottom';

  @HostBinding('attr.anchor')
  @Input() anchor: 'start'|'center'|'end' = 'start';

  @HostBinding('attr.color')
  @Input() color: ThemePalette;
}