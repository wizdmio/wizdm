import { trigger, state, animate, style, transition } from '@angular/animations';

const $timing = '350ms ease';//cubic-bezier(0.5, 0, 0.5, 1)';

export const $animations = [

  trigger('editing', [
    state('false', style('*')),
    state('true', style({
      transform: 'translateZ(-100px)',
      boxShadow: '0 0 6px 3px rgba(0,0,0,0.125)'
    })),
    transition('false <=> true', animate($timing))
  ])
]