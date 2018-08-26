import { Component, Output, EventEmitter } from '@angular/core';
import { wmColor } from 'app/core';
import { $colors } from './colors';

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
