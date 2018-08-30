import { Component, Input, Output, EventEmitter, Inject, ViewChild } from '@angular/core';
import { wmColor, wmcolor, wmColorMap, COLOR_MAP } from 'app/core';

@Component({
  selector: 'wm-color-picker',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss']
})
export class ColorsComponent {

  colors: wmcolor[];

  constructor(@Inject(COLOR_MAP) public colorMap: wmColorMap) { 

    this.colors = <wmcolor[]>Object.keys(colorMap)
      .filter( col => col !== 'black' && col !== 'white');
  }

  @Output() pick = new EventEmitter<wmColor>();

  // Current color to display the previous selection
  @Input() color: wmcolor;

  // Export the menu property to be used as a sub-menu item when needed
  @ViewChild('menuColors') menu;
}
