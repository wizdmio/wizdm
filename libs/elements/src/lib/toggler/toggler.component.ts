import { Component, Input, HostBinding } from '@angular/core';
import { $animations } from './toggler.animations';

export type wmTogglerStyle = 'menu' | 'more_vert' | 'more_horiz';

@Component({
  selector: 'wm-toggler',
  templateUrl: './toggler.component.html',
  styleUrls: ['./toggler.component.scss'],
  animations: $animations 
})
export class TogglerComponent {

  constructor() { }

  @Input() status = false;

  @Input('toggler-style') style: wmTogglerStyle = 'menu';
  
  // Apply the style attribute to select the proper toggler model 
  @HostBinding('attr.toggler-style') get styleAttribute() {
    return this.style;
  }
/*
  @HostBinding('@toggler') get toggler() {
    return this.status;
  }
*/
  // Trigger the animations based on current style
  public get trigger() {
    return this.status ? this.style : 'close';
  }
}