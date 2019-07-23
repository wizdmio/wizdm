import { Component, Input, Output, EventEmitter, Inject, ViewChild } from '@angular/core';
import { wmColor, wmcolor, wmColorMap, COLOR_MAP } from '../colors/colors';

@Component({
  selector: 'wm-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {

  colors: wmcolor[];

  constructor(@Inject(COLOR_MAP) public colorMap: wmColorMap) { 

    this.colors = <wmcolor[]>Object.keys(colorMap)
      .filter( col => col !== 'black' && col !== 'white');
  }

  @Output() pick = new EventEmitter<wmColor>();

  // Current color to display the previous selection
  @Input() color: wmcolor;

  // Export the menu property to be used as a sub-menu item when needed
  @ViewChild('menuColors', { static: true }) menu;
}
