import { trigger, state, animate, style, transition, keyframes, group, query, stagger } from '@angular/animations';

const landingTiming = '2s ease';

export const $animations = [

  trigger('landing', [
    transition(':enter', [
      style({
        transform: 'scale(1.2)',
        opacity: 0
      }),
      animate(landingTiming, style('*'))
    ])  
  ])
]