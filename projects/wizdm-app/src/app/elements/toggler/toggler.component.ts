import { Component, Input, HostBinding } from '@angular/core';
import { trigger, state, animate, style, transition } from '@angular/animations';
const $timing = '200ms ease-out';

export type wmTogglerStyle = 'menu' | 'more_vert' | 'more_horiz';

@Component({
  selector: 'wm-toggler',
  template: `<span top    [@top]="trigger"></span>
             <span middle [@middle]="trigger"></span>
             <span bottom [@bottom]="trigger"></span>`,
  styleUrls: ['./toggler.component.scss'],
  animations: [
    // Toggler top element
    trigger('top', [
      // Menu style: 
      // Rotates the top bar 135 deg and moves it down to the center
      state('menu', style({
        transform: 'rotate(-135deg)',
        top: '50%'
      })),
      // More vertical/horizontal styles: 
      // Stretches the dot into a line moving it down to the center and rotates it 45 deg
      state('more_vert, more_horiz', style({
        left: 0,
        top: '50%',
        width: '100%',
        height: '2px',
        transform: 'rotate(45deg)'
      })),
      // Default style on close
      state('close', style('*')),
      transition('* <=> *', animate($timing))
    ]),
    // Toggler middle element
    trigger('middle', [
      // Menu style: Fades the middle bar while rotating it 135 deg
      state('menu', style({
        transform: 'rotate(135deg)',
        opacity: 0
      })),
      // More vertical/horizontal styles: Just fades the middle dot away
      state('more_vert, more_horiz', style({ opacity: 0 })),
      // Default style on close
      state('close', style('*')),
      transition('* <=> *', animate($timing))
    ]),
    // Toggler bottom element
    trigger('bottom', [
      // Menu style: Rises the bottom bar to the middle while rotating it -45 deg
      state('menu', style({
        transform: 'rotate(-45deg)',
        top: '50%'
      })),
      // More vertical/horizontal styles:
      // Stretches the dot into a line moving it up to the center and rotates it 45 deg
      state('more_vert, more_horiz', style({
        left: 0,
        top: '50%',
        width: '100%',
        height: '2px',
        transform: 'rotate(135deg)'
      })),
      // Default style on close
      state('close', style('*')),
      transition('* <=> *', animate($timing))
    ])
  ]
})
export class TogglerComponent {

  constructor() { }

  @Input() status = false;

  @Input('toggler-style') style: wmTogglerStyle = 'menu';
  
  // Apply the style attribute to select the proper toggler model 
  @HostBinding('attr.toggler-style') get styleAttribute() {
    return this.style;
  }

  // Trigger the animations based on current style
  public get trigger() {
    return this.status ? this.style : 'close';
  }
}