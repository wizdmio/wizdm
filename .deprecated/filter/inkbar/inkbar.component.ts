import { Component, Input, HostBinding, ElementRef } from '@angular/core';
import { $animations } from './inkbar.animations';

export interface inkbarPosition {
  left: number;
  width: number;
}

@Component({
  selector: 'wm-inkbar',
  template: '',
  styleUrls: ['./inkbar.component.scss'],
  animations: $animations
})
export class InkbarComponent {

  private state = 0;
  private left = 0;
  private width = 0;

  constructor() { }

  @Input() set position(pos: inkbarPosition) {
    this.left = pos.left;
    this.width = pos.width;
    this.state++;
  }

  // Triggers the inkbar animation with custom left/width parameters
  @HostBinding('@slide') get trigger() {
    return { 
      value: this.state, params: {
        left: `${this.left}px`, 
        width: `${this.width}px`
      }
    };
  }
}