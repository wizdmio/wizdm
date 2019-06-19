import { trigger, state, animate, style, transition, keyframes, group, query, stagger } from '@angular/animations';

const $timing = '500ms ease-in';

export const $animations = [

  trigger('fadeIn', [
    transition(':enter, * => *', [
      style({ opacity: 0 }),
      animate($timing, style('*'))
    ])  
  ])
]