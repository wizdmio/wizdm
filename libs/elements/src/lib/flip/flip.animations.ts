import { trigger, state, animate, style, transition, query, stagger, group, animateChild } from '@angular/animations';

const $timing = '200ms ease-out';

export let $animations = [

  trigger('flip', [
    transition('* => *', [

      query(':enter', style({ transform: 'rotateY(-90deg)' }), { optional: true }),
      
      query(':leave', [
        animate($timing, style({ transform: 'rotateY(90deg)' }))
      ], { optional: true }),

      query(':enter', [
        animate($timing, style({ transform: 'rotateY(0)' }))
      ], { optional: true })
    ])
  ])
]