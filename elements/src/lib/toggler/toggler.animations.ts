import { trigger, state, animate, style, transition, group, query, animateChild } from '@angular/animations';
const $timing = '350ms ease-out';

export const $animations = [
  /*
  trigger('toggler', [
    transition('* => *', group([ 
      //query(':self', []),
      query('@top', animateChild()),
      query('@middle', animateChild()),
      query('@bottom', animateChild())
    ]))
  ]),
*/
  // Toggler top element
  trigger('top', [
    // Menu style: 
    // Rotates the top bar 135 deg and moves it down to the center
    state('menu', style({
      transform: 'translateY(8px) rotate(-135deg)'
    })),
    // More vertical/horizontal styles: 
    // Stretches the dot into a line moving it down to the center and rotates it 45 deg
    state('more_vert', style({
      width: '2px',
      height: '20px',
      transform: 'translateX(1px) rotate(-45deg)'
    })),
    state('more_horiz', style({
      width: '20px',
      height: '2px',
      transform: 'translateY(1px) rotate(45deg)'
    })),
    // Default style on close
    state('close', style('*')),
    transition('* => *', animate($timing))
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
    transition('* => *', animate($timing))
  ]),
  // Toggler bottom element
  trigger('bottom', [
    // Menu style: Rises the bottom bar to the middle while rotating it -45 deg
    state('menu', style({
      transform: 'translateY(-8px) rotate(-45deg)'
    })),
    // More vertical/horizontal styles:
    // Stretches the dot into a line moving it up to the center and rotates it 45 deg
    state('more_vert', style({
      width: '2px',
      height: '20px',
      transform: 'translateX(1px) rotate(45deg)'
    })),
    state('more_horiz', style({
      width: '20px',
      height: '2px',
      transform: 'translateY(1px) rotate(-45deg)'
    })),
    // Default style on close
    state('close', style('*')),
    transition('* => *', animate($timing))
  ])
]