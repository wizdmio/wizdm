import { Component, Input, HostBinding, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ThemePalette } from '@angular/material/core'
import { $animations } from './toggler.animations';

export type wmTogglerStyle = 'menu' | 'more_vert' | 'more_horiz';

@Component({
  selector: 'wm-toggler',
  templateUrl: './toggler.component.html',
  styleUrls: ['./toggler.component.scss'],
  host: { 'class': 'wm-toggler' },
  encapsulation: ViewEncapsulation.None,
  animations: $animations
})
export class TogglerComponent {

  @Input('toggled') set toggling(value: boolean) { this.toggled = coerceBooleanProperty(value); }
  public toggled = false;

  @HostBinding('attr.color')
  @Input() color: ThemePalette;

  @HostBinding('attr.toggler-style')
  @Input('toggler-style') style: wmTogglerStyle = 'menu';
  
/*
  @HostBinding('@toggler') get toggler() {
    return this.toggled;
  }
*/
  // Trigger the animations based on current style
  public get trigger() {
    return this.toggled ? this.style : 'close';
  }
}