import { trigger, state, animate, style, transition, query, stagger, group } from '@angular/animations';

const $timing = '450ms cubic-bezier(.8, -0.6, 0.2, 1.5)';

export let $animations = [

  trigger('menu', [
    transition('* => *', [
      query(':enter', [
        style({ 
          transform: 'scale(0.5)', 
          opacity: 0 
        }),
        stagger('100ms', animate($timing) )
      ], { optional: true })
    ])
  ])
]