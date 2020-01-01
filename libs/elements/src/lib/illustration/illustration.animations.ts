import { trigger, state, animate, style, transition, query, stagger, group, animateChild } from '@angular/animations';

const $timing = '200ms ease-out';

export const $animations = [

  trigger('fadeIn', [
    //state('off', style('*') ),
    transition(':enter', [
      style({ opacity: 0 }),
      animate($timing, style('*'))
    ])
  ])
];