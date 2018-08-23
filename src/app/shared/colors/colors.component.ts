import { Component, Output, EventEmitter } from '@angular/core';

import { $colors, wmColor } from './colors';

@Component({
  selector: 'wm-color-picker',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss']
})
export class ColorsComponent {

  colors: wmColor[] = $colors;

  constructor() { }

  @Output() pick = new EventEmitter<wmColor>();
}
