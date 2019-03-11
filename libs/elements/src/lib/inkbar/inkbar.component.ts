import { Component, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core'
import { $animations } from './inkbar.animations';

export interface inkbarPosition {
  left?: number;
  width?: number;
}

@Component({
  selector: 'wm-inkbar',
  templateUrl: './inkbar.component.html',
  styleUrls: ['./inkbar.component.scss'],
  //host: {'class': 'wm-inkbar-theme'},
  animations: $animations
})
export class InkbarComponent {

  private pos: inkbarPosition = { left: 0, width: 0 };

  constructor() { }

  @Input() height = 2;

  @Input() color: ThemePalette;
  
  @Input() set position(pos: inkbarPosition) {
    this.pos = { ...this.pos, ...pos };
  }

  // Triggers the inkbar animation with custom left/width parameters
  get trigger() {
    return { 
      value: this.pos, params: {
        left: `${this.pos.left}px`,
        width: `${this.pos.width}px`
      }
    };
  }
}