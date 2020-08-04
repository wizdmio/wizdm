import { Component, Input, HostBinding, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material/core'

@Component({
  selector: 'wm-balloon',
  templateUrl: './balloon.component.html',
  styleUrls: ['./balloon.component.scss'],
  host: { 'class': 'wm-balloon' },
  encapsulation: ViewEncapsulation.None
})
export class BalloonComponent  {

  @HostBinding('attr.side')
  @Input() side: 'left'|'top'|'right'|'bottom';

  @HostBinding('attr.anchor')
  @Input() anchor: 'start'|'center'|'end';

  @HostBinding('attr.color')
  @Input() color: ThemePalette;
}