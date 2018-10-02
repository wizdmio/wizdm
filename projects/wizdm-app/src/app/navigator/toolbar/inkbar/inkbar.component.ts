import { Component, Input } from '@angular/core';
import { $animations } from './inkbar.animations';

export interface inkbarPosition {
  left?: number;
  width?: number;
}

@Component({
  selector: 'wm-inkbar',
  template: `<div>
              <div [@slide]="trigger"
                   [style.height.px]="height"
                   [style.background-color]="color">
              </div>
            </div>`,
  styles: [],
  animations: $animations
})
export class InkbarComponent {

  private pos: inkbarPosition;

  constructor() { }

  @Input() height = 2;
  @Input() color = '#42a5f5';
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